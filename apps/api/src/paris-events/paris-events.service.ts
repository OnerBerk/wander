import {Injectable, Logger, InternalServerErrorException} from '@nestjs/common';
import {RedisService} from '../redis/redis.service';
import {HttpClientService} from '../http-client/http-client.service';
import {EventData, PriceType, Coordinates} from '@wander/types';
import {QueryFilterDto} from '../filters/dtos/query-filter.dto';
import {QueryBuilder} from '../filters/utils/query-builder';
import {FieldMapper, ParisEventRaw, ParisEventsApiResponse} from './local-types/paris-events.types';

const BASE_URL = 'https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records';
const CACHE_TTL = 21600;

@Injectable()
export class ParisEventsService {
  private readonly logger = new Logger(ParisEventsService.name);

  private readonly FIELD_MAP: FieldMapper = {
    tag: (v) => `qfap_tags like '%${v}%'`,
    price: (v) => `price_type='${v === 'free' ? 'gratuit' : 'payant'}'`,
    city: (v) => `address_city='${v}'`,
  };
  constructor(
    private readonly redisService: RedisService,
    private readonly httpClient: HttpClientService
  ) {}

  private buildUrl(query: QueryFilterDto): string {
    return new QueryBuilder(query, this.FIELD_MAP).build(BASE_URL);
  }

  async getEvents(query: QueryFilterDto): Promise<{total: number; events: EventData[]}> {
    const cacheKey = `paris-events:${JSON.stringify(query)}`;

    try {
      const cached = await this.redisService.get<{total: number; events: EventData[]}>(cacheKey);
      if (cached) {
        this.logger.log('🎯 Paris events cache hit');
        return cached;
      }

      const url = this.buildUrl(query);
      const data = await this.httpClient.get<ParisEventsApiResponse>(url);

      const events = data.results.reduce<EventData[]>((acc: EventData[], raw: ParisEventRaw) => {
        if (!raw.lat_lon || raw.lat_lon.lat === 0 || raw.lat_lon.lon === 0) return acc;
        acc.push(this.mapEvent(raw));
        return acc;
      }, []);

      const result = {total: data.total_count, events};

      await this.redisService.set(cacheKey, result, CACHE_TTL);
      this.logger.log(`💾 Paris events cached — ${result.events.length} events`);

      return result;
    } catch (error) {
      this.logger.error('❌ Failed to fetch paris events');
      throw new InternalServerErrorException('Failed to fetch paris events');
    }
  }

  private mapEvent(raw: ParisEventRaw): EventData {
    const priceType: PriceType | null =
      raw.price_type === 'gratuit' ? 'free' : raw.price_type === 'payant' ? 'paid' : null;

    const location: Coordinates = {
      lat: raw.lat_lon!.lat,
      lng: raw.lat_lon!.lon,
    };

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
      tags: raw.qfap_tags ? raw.qfap_tags.split(';') : [],
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
}
