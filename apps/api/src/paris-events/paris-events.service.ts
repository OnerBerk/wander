import {Injectable, Logger, InternalServerErrorException} from '@nestjs/common';
import {RedisService} from '../redis/redis.service';
import {HttpClientService} from '../http-client/http-client.service';
import {EventData, PriceType, Coordinates, EventTag} from '@wander/types';
import {QueryFilterDto} from '../filters/dtos/query-filter.dto';
import {buildParisEventUrl} from './utils/build-paris-event-url';
import {ParisEventRaw, ParisEventsApiResponse} from './local-types/paris-events.types';

const CACHE_TTL = 21600;
const GEOCODE_CACHE_TTL = 86400;
const PARIS_DEFAULT_COORDINATES: Coordinates = {lat: 48.856578, lng: 2.351828};
const DEFAULT_COORDINATE_EPSILON = 0.00001;
const EARTH_RADIUS_KM = 6371;
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
    private readonly httpClient: HttpClientService
  ) {}

  canHandle(query: QueryFilterDto): boolean {
    if (!query.tags?.length) return true;
    return query.tags.some((t) => ALLOWED_TAGS.includes(t as EventTag));
  }
  async getEvents(query: QueryFilterDto): Promise<{total: number; events: EventData[]}> {
    const cacheKey = `paris-events:${JSON.stringify(query)}`;

    try {
      const cached = await this.redisService.get<{total: number; events: EventData[]}>(cacheKey);
      if (cached) {
        this.logger.log('🎯 Paris events cache hit');
        return cached;
      }

      const url = buildParisEventUrl(query);
      const data = await this.httpClient.get<ParisEventsApiResponse>(url);

      const mappedEvents = await Promise.all(data.results.map((raw) => this.mapEvent(raw)));
      const events = mappedEvents.filter(
        (event): event is EventData =>
          event !== null &&
          this.getDistanceInKm({lat: query.lat, lng: query.lng}, event.location) <= query.radius
      );

      const result = {total: data.total_count, events};

      await this.redisService.set(cacheKey, result, CACHE_TTL);
      this.logger.log(`💾 Paris events cached — ${result.events.length} events`);

      return result;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch paris events');
    }
  }

  private async mapEvent(raw: ParisEventRaw): Promise<EventData | null> {
    const priceType: PriceType | null =
      raw.price_type === 'gratuit' ? 'free' : raw.price_type === 'payant' ? 'paid' : null;

    const location = await this.resolveLocation(raw);
    if (!location) return null;

    return {
      id: raw.id,
      title: raw.title,
      leadText: raw.lead_text,
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
      addressName: raw.address_name,
      addressStreet: raw.address_street,
      addressZipcode: raw.address_zipcode,
      addressCity: raw.address_city,
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

    const sourceCoordinates: Coordinates = {lat: raw.lat_lon.lat, lng: raw.lat_lon.lon};
    if (!this.isDefaultSourceCoordinate(sourceCoordinates)) {
      return sourceCoordinates;
    }

    const address = this.buildAddressQuery(raw);
    if (!address) return null;

    const geocodedCoordinates = await this.geocodeAddress(address);
    return geocodedCoordinates;
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
        features?: Array<{geometry?: {coordinates?: [number, number]}}>;
      }>(geocodeUrl);

      const coordinates = response.features?.[0]?.geometry?.coordinates;
      if (!coordinates || coordinates.length < 2) return null;

      const [lng, lat] = coordinates;
      if (typeof lat !== 'number' || typeof lng !== 'number') return null;

      const location: Coordinates = {lat, lng};
      await this.redisService.set(cacheKey, location, GEOCODE_CACHE_TTL);
      return location;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown geocoding error';
      this.logger.warn(`Address geocoding failed for "${address}" (${message})`);
      return null;
    }
  }

  private getDistanceInKm(from: Coordinates, to: Coordinates): number {
    const latDelta = this.toRadians(to.lat - from.lat);
    const lngDelta = this.toRadians(to.lng - from.lng);
    const fromLatRadians = this.toRadians(from.lat);
    const toLatRadians = this.toRadians(to.lat);

    const a =
      Math.sin(latDelta / 2) * Math.sin(latDelta / 2) +
      Math.cos(fromLatRadians) *
        Math.cos(toLatRadians) *
        Math.sin(lngDelta / 2) *
        Math.sin(lngDelta / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return EARTH_RADIUS_KM * c;
  }

  private toRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }
}
