import 'reflect-metadata';
import { DateTime } from 'luxon';
import { EventData } from '@wander/types';
import { AiToolsService } from '../ai-tools.service';
import { EventsService } from '../../events/events.service';
import { setupUnitTest } from '../../test-utils/setup-unit-test';
import { setupEvents, filterEvents } from '../../test-utils/setup-events';
import { QueryFilterDto } from '../../filters/dtos/query-filter.dto';

const mockEventsService = {
  getAll: jest.fn(),
};

type GetEventsTool = {
  execute: (input: {
    filters: Array<{ category?: EventData['tags'][number]; keyword?: string }>;
    datePhrase?: string;
  }) => Promise<{ count: number }>;
};

function eventIds(events: EventData[]): string[] {
  return events.map((event) => event.id).sort();
}

describe('AiToolsService', () => {
  let service: AiToolsService;
  let events: EventData[];
  let onEventsFound: jest.Mock;

  beforeAll(async () => {
    events = setupEvents(DateTime.now().setZone('Europe/Paris'));
    service = await setupUnitTest(AiToolsService, [{ provide: EventsService, useValue: mockEventsService }]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    onEventsFound = jest.fn();
    mockEventsService.getAll.mockImplementation((query: QueryFilterDto) =>
      Promise.resolve(filterEvents(events, query)),
    );
  });

  function getEventsTool(): GetEventsTool {
    return service.getTools(onEventsFound).getEvents as GetEventsTool;
  }

  it.each(['Concert', 'Expo'] as const)('returns only %s events when filtering by category', async (category) => {
    const result = await getEventsTool().execute({
      filters: [{ category }],
    });

    const matched = onEventsFound.mock.calls[0][0] as EventData[];
    expect(eventIds(matched)).toEqual(eventIds(events.filter((event) => event.tags.includes(category))));
    expect(result).toEqual({ count: matched.length });
  });

  it('returns events matching a keyword in title or description', async () => {
    const result = await getEventsTool().execute({
      filters: [{ keyword: 'argentiques' }],
    });

    const matched = onEventsFound.mock.calls[0][0] as EventData[];
    expect(eventIds(matched)).toEqual(['today-expo']);
    expect(result).toEqual({ count: 1 });
  });

  it('returns only today events for datePhrase "aujourd\'hui"', async () => {
    await getEventsTool().execute({
      filters: [{ category: 'Concert' }],
      datePhrase: "aujourd'hui",
    });

    const matched = onEventsFound.mock.calls[0][0] as EventData[];
    expect(eventIds(matched)).toEqual(['today-concert']);
    expect(matched.every((event) => event.tags.includes('Concert'))).toBe(true);
  });

  it('returns next-month events for datePhrase "le mois prochain"', async () => {
    await getEventsTool().execute({
      filters: [{ category: 'Expo' }],
      datePhrase: 'le mois prochain',
    });

    const matched = onEventsFound.mock.calls[0][0] as EventData[];
    expect(eventIds(matched)).toEqual(['next-month-expo']);
  });

  it('returns empty list when nothing matches', async () => {
    const result = await getEventsTool().execute({
      filters: [{ category: 'Expo', keyword: 'inexistant-xyz' }],
      datePhrase: "aujourd'hui",
    });

    expect(onEventsFound).toHaveBeenCalledWith([]);
    expect(result).toEqual({ count: 0 });
  });
});
