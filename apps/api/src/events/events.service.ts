import { Injectable, Logger } from '@nestjs/common';
import { EventData } from '@wander/types';
import { QueryFilterDto } from '../filters/dtos/query-filter.dto';
import { ParisEventsService } from '../paris-events/paris-events.service';
import { EventsCatalogService } from '../paris-events/events-catalog.service';

/** Liste et fiche événement. Les deux lisent le catalogue en mémoire, pas Redis. */
@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    private readonly parisEventsService: ParisEventsService,
    private readonly eventsCatalog: EventsCatalogService,
  ) {}

  /** Filtre le catalogue déjà chargé (période, tags, prix). */
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

  /** Une fiche, retrouvée par id dans la même copie mémoire. */
  async getOne(id: string): Promise<EventData | null> {
    return this.eventsCatalog.getById(id);
  }
}
