import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { DateTime } from 'luxon';
import { RedisService } from '../redis/redis.service';
import { HttpClientService } from '../http-client/http-client.service';
import { EventData, PriceType, Coordinates, EventTag, EventPeriod } from '@wander/types';
import { QueryFilterDto } from '../filters/dtos/query-filter.dto';
import { GeoDto } from '../common-dtos/geo.dto';
import { buildParisEventUrl } from './utils/build-paris-event-url';
import { getDateRangeForPeriod } from '../events/utils';
import { parisEventRawSchema, ParisEventRaw } from './schemas/paris-event-raw.schema';

const GEOCODE_CACHE_TTL = 86400;
const PARIS_DEFAULT_COORDINATES: Coordinates = { lat: 48.856578, lng: 2.351828 };
const DEFAULT_COORDINATE_EPSILON = 0.00001;
const EVENTS_REDIS_KEY = 'events:actifs';
const ALLOWED_TAGS: EventTag[] = [
  'Art contemporain',
  'Conférence',
  'Concert',
  'Enfants',
  'Expo',
  'Festival',
  'Gourmand',
  'Histoire',
  'Littérature',
  'Loisirs',
  'Nature',
  'Spectacle musical',
  'Théâtre',
];

@Injectable()
export class ParisEventsService {
  private readonly logger = new Logger(ParisEventsService.name);

  constructor(
    private readonly redisService: RedisService,
    private readonly httpClient: HttpClientService,
  ) {}

  canHandle(query: QueryFilterDto): boolean {
    if (!query.tags?.length) return true;
    return query.tags.some((t) => ALLOWED_TAGS.includes(t as EventTag));
  }

  /**
   * Lit la base d'events depuis Redis et filtre en mémoire.
   * La base est remplie par le job d'ingestion via fetchEventsByZone.
   */
  async getEvents(query: QueryFilterDto): Promise<{ total: number; events: EventData[] }> {
    try {
      const all = await this.redisService.get<EventData[]>(EVENTS_REDIS_KEY);
      if (!all) return { total: 0, events: [] };

      const { start, end } = getDateRangeForPeriod(query.period);

      const events = all.filter((e) => {
        if (!e.dateStart) return false;

        const dateStart = DateTime.fromISO(e.dateStart);
        if (dateStart < start) return false;
        if (end && dateStart > end) return false;

        if (query.tags?.length && !query.tags.some((t) => e.tags.includes(t))) return false;
        if (query.price === 'free' && e.priceType !== 'free') return false;
        if (query.price === 'paid' && e.priceType !== 'paid') return false;

        return true;
      });

      return { total: events.length, events };
    } catch (error) {
      throw new InternalServerErrorException('Failed to get events from cache');
    }
  }

  /**
   * Fetch les events d'une zone géographique pour l'ingestion.
   * Pas de cache, pas de filtre métier — retourne tous les events mappés.
   */
  async fetchEventsByZone(lat: number, lng: number, radiusKm: number, period: EventPeriod): Promise<EventData[]> {
    const geo: GeoDto = { lat, lng, radius: radiusKm };
    const url = buildParisEventUrl(geo, { period, limit: 100 });

    const raw = await this.httpClient.get<unknown>(url);

    const response = raw as { total_count?: number; results?: unknown[] };
    if (!Array.isArray(response?.results)) {
      this.logger.warn(`fetchEventsByZone (${lat},${lng}) — réponse API invalide ou vide`);
      return [];
    }

    const events = await Promise.all(
      response.results.map(async (rawEvent) => {
        const eventParsed = parisEventRawSchema.safeParse(rawEvent);
        if (!eventParsed.success) {
          this.logger.warn(
            `Event rejeté — id: ${(rawEvent as any)?.id ?? 'inconnu'} | champs: ${JSON.stringify(eventParsed.error.flatten().fieldErrors)}`,
          );
          return null;
        }
        return this.mapEvent(eventParsed.data);
      }),
    );

    return events.filter((e): e is EventData => e !== null);
  }
  private async mapEvent(raw: ParisEventRaw): Promise<EventData | null> {
    const priceType: PriceType | null =
      raw.price_type === 'gratuit' ? 'free' : raw.price_type === 'payant' ? 'paid' : null;

    const location = await this.resolveLocation(raw);
    if (!location) return null;

    return {
      id: raw.id,
      title: raw.title,
      leadText: raw.lead_text ?? '',
      description: raw.description,
      dateStart: raw.date_start ?? '',
      dateEnd: raw.date_end ?? '',
      occurrences: raw.occurrences,
      location,
      coverUrl: raw.cover_url,
      coverAlt: raw.cover_alt,
      priceType,
      priceDetail: raw.price_detail,
      tags: raw.qfap_tags ? (raw.qfap_tags.split(';') as EventTag[]) : [],
      url: raw.url,
      addressName: raw.address_name ?? '',
      addressStreet: raw.address_street ?? '',
      addressZipcode: raw.address_zipcode ?? '',
      addressCity: raw.address_city ?? '',
      audience: raw.audience,
      isIndoor: raw.event_indoor === 1,
      petsAllowed: raw.event_pets_allowed === 1,
      contactUrl: raw.contact_url,
      contactPhone: raw.contact_phone,
      accessType: raw.access_type,
      accessLink: raw.access_link,
    };
  }

  private async resolveLocation(raw: ParisEventRaw): Promise<Coordinates | null> {
    if (!raw.lat_lon || raw.lat_lon.lat === 0 || raw.lat_lon.lon === 0) return null;

    const sourceCoordinates: Coordinates = { lat: raw.lat_lon.lat, lng: raw.lat_lon.lon };
    if (!this.isDefaultSourceCoordinate(sourceCoordinates)) return sourceCoordinates;

    const address = this.buildAddressQuery(raw);
    if (!address) return null;

    return this.geocodeAddress(address);
  }

  private isDefaultSourceCoordinate(coordinates: Coordinates): boolean {
    return (
      Math.abs(coordinates.lat - PARIS_DEFAULT_COORDINATES.lat) < DEFAULT_COORDINATE_EPSILON &&
      Math.abs(coordinates.lng - PARIS_DEFAULT_COORDINATES.lng) < DEFAULT_COORDINATE_EPSILON
    );
  }

  private buildAddressQuery(raw: ParisEventRaw): string | null {
    const parts = [raw.address_name, raw.address_street, raw.address_zipcode, raw.address_city]
      .map((value) => value?.trim())
      .filter((value): value is string => Boolean(value));

    if (parts.length === 0) return null;
    return parts.join(', ');
  }

  private async geocodeAddress(address: string): Promise<Coordinates | null> {
    const cacheKey = `paris-events:geocode:${address.toLowerCase()}`;
    const cached = await this.redisService.get<Coordinates>(cacheKey);
    if (cached) return cached;

    try {
      const geocodeUrl = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(address)}&limit=1`;
      const response = await this.httpClient.get<{
        features?: Array<{ geometry?: { coordinates?: [number, number] } }>;
      }>(geocodeUrl);

      const coordinates = response.features?.[0]?.geometry?.coordinates;
      if (!coordinates || coordinates.length < 2) return null;

      const [lng, lat] = coordinates;
      if (typeof lat !== 'number' || typeof lng !== 'number') return null;

      const location: Coordinates = { lat, lng };
      await this.redisService.set(cacheKey, location, GEOCODE_CACHE_TTL);
      return location;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown geocoding error';
      this.logger.warn(`Address geocoding failed for "${address}" (${message})`);
      return null;
    }
  }
}
