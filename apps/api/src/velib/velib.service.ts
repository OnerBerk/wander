import {Injectable, Logger, InternalServerErrorException} from '@nestjs/common';
import {RedisService} from '../redis/redis.service';
import {HttpClientService} from '../http-client/http-client.service';
import {VelibStation} from '@wander/types';
import {GeoDto} from '../common-dtos/geo.dto';
import {buildVelibUrl} from './utils/build-velib-url';
import {VelibApiResponse, VelibStationRaw} from './local-types/velib.types';

const CACHE_TTL = 60;

@Injectable()
export class VelibService {
  private readonly logger = new Logger(VelibService.name);

  constructor(
    private readonly redisService: RedisService,
    private readonly httpClient: HttpClientService
  ) {}

  async getStations(query: GeoDto): Promise<VelibStation[]> {
    const cacheKey = `velib:${query.lat}:${query.lng}:${query.radius}`;

    try {
      const cached = await this.redisService.get<VelibStation[]>(cacheKey);
      if (cached) {
        this.logger.log('🎯 Velib cache hit');
        return cached;
      }

      const url = buildVelibUrl(query);
      const data = await this.httpClient.get<VelibApiResponse>(url);

      const stations = data.results.reduce<VelibStation[]>((acc, raw) => {
        if (!raw.coordonnees_geo) return acc;
        acc.push(this.mapStation(raw));
        return acc;
      }, []);

      await this.redisService.set(cacheKey, stations, CACHE_TTL);
      this.logger.log(`💾 Velib cached — ${stations.length} stations`);

      return stations;
    } catch (error) {
      this.logger.error('❌ Failed to fetch velib stations', error);
      throw new InternalServerErrorException('Failed to fetch velib stations');
    }
  }

  private mapStation(raw: VelibStationRaw): VelibStation {
    return {
      id: raw.stationcode,
      name: raw.name,
      capacity: raw.capacity,
      bikesAvailable: raw.numbikesavailable,
      docksAvailable: raw.numdocksavailable,
      mechanical: raw.mechanical,
      ebike: raw.ebike,
      isRenting: raw.is_renting === 'OUI',
      isReturning: raw.is_returning === 'OUI',
      location: {lat: raw.coordonnees_geo!.lat, lng: raw.coordonnees_geo!.lon},
    };
  }
}
