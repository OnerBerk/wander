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

function eventIds(events: EventData[]): string[] {
  return events.map((event) => event.id).sort();
}

describe('AiToolsService', () => {
  let service: AiToolsService;
  let events: EventData[];

  beforeAll(async () => {
    events = setupEvents(DateTime.now().setZone('Europe/Paris'));
    service = await setupUnitTest(AiToolsService, [{ provide: EventsService, useValue: mockEventsService }]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    mockEventsService.getAll.mockImplementation((query: QueryFilterDto) =>
      Promise.resolve(filterEvents(events, query)),
    );
  });

  function search(input: { filters: Array<{ category?: EventData['tags'][number]; keyword?: string }>; datePhrase?: string }) {
    const execute = service.getTools().getEvents.execute;
    if (!execute) throw new Error('getEvents.execute missing');
    return execute(input, { toolCallId: 'test', messages: [], context: {} });
  }

  it.each(['Concert', 'Expo'] as const)('returns only %s events when filtering by category', async (category) => {
    const result = await search({
      filters: [{ category }],
    });

    const expected = events.filter((event) => event.tags.includes(category));
    expect(eventIds(result.events)).toEqual(eventIds(expected));
    expect(result.count).toBe(expected.length);
  });

  it('returns events matching a keyword in title or description', async () => {
    const result = await search({
      filters: [{ keyword: 'argentiques' }],
    });

    expect(eventIds(result.events)).toEqual(['100003']);
    expect(result.count).toBe(1);
  });

  it('returns only today events for datePhrase "aujourd\'hui"', async () => {
    const result = await search({
      filters: [{ category: 'Concert' }],
      datePhrase: "aujourd'hui",
    });

    expect(eventIds(result.events)).toEqual(['100002']);
    expect(result.events.every((event: EventData) => event.tags.includes('Concert'))).toBe(true);
    expect(result.count).toBe(1);
  });

  it('returns next-month events for datePhrase "le mois prochain"', async () => {
    const result = await search({
      filters: [{ category: 'Expo' }],
      datePhrase: 'le mois prochain',
    });

    expect(eventIds(result.events)).toEqual(['100008']);
    expect(result.count).toBe(1);
  });

  it('returns empty list when nothing matches', async () => {
    const result = await search({
      filters: [{ category: 'Expo', keyword: 'inexistant-xyz' }],
      datePhrase: "aujourd'hui",
    });

    expect(result.events).toEqual([]);
    expect(result.count).toBe(0);
  });
});
