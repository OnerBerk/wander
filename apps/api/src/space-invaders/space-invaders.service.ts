import {Injectable, InternalServerErrorException, Logger} from '@nestjs/common';
import {RedisService} from '../redis/redis.service';
import {InvadersOverpassElement} from '@wander/types';

const CACHE_KEY = 'space-invaders';
const CACHE_TTL = 172800;
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
const OVERPASS_QUERY =
  '[out:json];node["artwork_type"="mosaic"]["artist_name"="Invader"](48.1,1.4,49.2,3.6);out center;';

@Injectable()
export class SpaceInvadersService {
  private readonly logger = new Logger(SpaceInvadersService.name);

  constructor(private readonly redisService: RedisService) {}

  async getSpaceInvaders(): Promise<InvadersOverpassElement[]> {
    const cached = await this.redisService.get<InvadersOverpassElement[]>(CACHE_KEY);
    if (cached) return cached;

    try {
      const response = await fetch(OVERPASS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json,text/plain,*/*',
          'Accept-Language': 'en-US,en;q=0.9',
          'User-Agent': 'Wander/1.0',
        },
        body: OVERPASS_QUERY,
      });

      if (!response.ok) {
        throw new Error(`Overpass API responded with status ${response.status}`);
      }

      const data = (await response.json()) as {elements: InvadersOverpassElement[]};
      await this.redisService.set(CACHE_KEY, data.elements, CACHE_TTL);
      return data.elements;
    } catch (error) {
      this.logger.error('SpaceInvadersService.getSpaceInvaders failed', error);
      throw new InternalServerErrorException('Failed to fetch Space Invaders data');
    }
  }
}
