import {Injectable, Logger} from '@nestjs/common';
import {EventData} from '@wander/types';
import {QueryFilterDto} from '../filters/dtos/query-filter.dto';
import {ParisEventsService} from '../paris-events/paris-events.service';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(private readonly parisEventsService: ParisEventsService) {}

  async getAll(query: QueryFilterDto): Promise<EventData[]> {
    const sources = [this.parisEventsService];

    const eligibleSources = sources.filter((s) => s.canHandle(query));

    const results = await Promise.allSettled(eligibleSources.map((s) => s.getEvents(query)));

    return results.reduce<EventData[]>((acc, r, i) => {
      if (r.status === 'fulfilled') {
        acc.push(...r.value.events);
      } else {
        this.logger.error(`❌ Source ${i} failed`, r.reason);
      }
      return acc;
    }, []);
  }
}
