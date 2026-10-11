import { Injectable, Logger } from '@nestjs/common';
import { EventData } from '@wander/types';
import { QueryFilterDto } from '../filters/dtos/query-filter.dto';
import { ParisEventsService } from '../paris-events/paris-events.service';
import { RedisService } from '../redis/redis.service';

const EVENTS_REDIS_KEY = 'events:actifs';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    private readonly parisEventsService: ParisEventsService,
    private readonly redisService: RedisService,
  ) {}

  async getAll(query: QueryFilterDto): Promise<EventData[]> {
    const sources = [this.parisEventsService];
    const eligibleSources = sources.filter((s) => s.canHandle(query));
    const results = await Promise.allSettled(eligibleSources.map((s) => s.getEvents(query)));

    return results.reduce<EventData[]>((acc, r, i) => {
      if (r.status === 'fulfilled') {
        acc.push(...r.value.events);
      } else {
        const sourceName = eligibleSources[i]?.constructor?.name ?? `Source${i}`;
        this.logger.error(`${sourceName}.getEvents failed`);
      }
      return acc;
    }, []);
  }

  async getOne(id: string): Promise<EventData | null> {
    const allEvents = await this.redisService.get<EventData[]>(EVENTS_REDIS_KEY);
    if (!allEvents?.length) return null;

    return allEvents.find((event) => event.id === id) ?? null;
  }
}
