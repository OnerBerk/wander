import { Injectable } from '@nestjs/common';
import { tool, ToolSet } from 'ai';
import { z } from 'zod';
import { DateTime } from 'luxon';
import * as chrono from 'chrono-node';
import { EventData, EventTag } from '@wander/types';
import { EventsService } from '../events/events.service';
import { QueryFilterDto } from '../filters/dtos/query-filter.dto';

const EVENT_TAGS = [
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
  'Balade urbaine',
  'BD',
  'Brocante',
  'Photo',
  'Santé',
  'Sciences',
  'Sport',
  'Street-art',
] as const satisfies readonly EventTag[];

const eventFilterSchema = z.object({
  category: z.enum(EVENT_TAGS).optional(),
  keyword: z.string().optional(),
});
type EventFilter = z.infer<typeof eventFilterSchema>;

@Injectable()
export class AiToolsService {
  constructor(private readonly eventsService: EventsService) {}

  getTools(onEventsFound: (events: EventData[]) => void): ToolSet {
    return {
      getEvents: tool({
        description:
          'Recherche des événements Wander par une ou plusieurs paires catégorie/mot-clé, avec une période optionnelle.',
        inputSchema: z.object({
          filters: z.array(eventFilterSchema).min(1),
          datePhrase: z
            .string()
            .optional()
            .describe(
              "Si l'utilisateur mentionne une date, un jour ou une période, recopie EXACTEMENT cette expression telle qu'elle apparaît dans son message (ex: 'samedi prochain', 'la semaine prochaine', 'le 28 septembre'). Ne calcule aucune date toi-même. Laisse vide si aucune notion de temps n'est mentionnée.",
            ),
        }),
        execute: async ({ filters, datePhrase }) => {
          const results = await this.searchEvents(filters, datePhrase);
          onEventsFound(results);
          return { count: results.length };
        },
      }),
    };
  }

  private async searchEvents(filters: EventFilter[], datePhrase?: string): Promise<EventData[]> {
    const tags = filters.map((f) => f.category).filter((tag): tag is EventTag => tag !== undefined);

    const { dateFrom, dateTo } = this.parseDateRange(datePhrase);

    const query: QueryFilterDto = {
      ...(tags.length ? { tags } : {}),
      ...(dateFrom ? { dateFrom, dateTo } : {}),
    };

    const events = await this.eventsService.getAll(query);

    return events.filter((event) =>
      filters.some((f) => {
        const matchesCategory = !f.category || event.tags.includes(f.category);
        const matchesKeyword =
          !f.keyword || `${event.title} ${event.description ?? ''}`.toLowerCase().includes(f.keyword.toLowerCase());
        return matchesCategory && matchesKeyword;
      }),
    );
  }

  private parseDateRange(datePhrase?: string): { dateFrom?: string; dateTo?: string } {
    if (!datePhrase) return {};

    const [result] = chrono.fr.parse(datePhrase, DateTime.now().setZone('Europe/Paris').toJSDate(), {
      forwardDate: true,
    });
    if (!result) return {};

    const resolved = DateTime.fromJSDate(result.start.date());

    let start = resolved;
    let end = resolved;

    if (/semaine/i.test(datePhrase)) {
      start = resolved.startOf('week');
      end = resolved.endOf('week');
    } else if (/mois/i.test(datePhrase)) {
      start = resolved.startOf('month');
      end = resolved.endOf('month');
    }

    const dateFrom = start.toISODate();
    const dateTo = end.toISODate();

    return dateFrom && dateTo ? { dateFrom, dateTo } : {};
  }
}
