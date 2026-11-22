import { INestApplication } from '@nestjs/common';
import { DateTime } from 'luxon';
import { EventData } from '@wander/types';
import { setupApi } from '../../test-utils/setup-api';
import { setupEvents } from '../../test-utils/setup-events';
import { TestTool } from '../../test-utils/test-tools';
import { RedisService } from '../../redis/redis.service';
import { EventsCatalogService } from '../../paris-events/events-catalog.service';
import { EventsModule } from '../events.module';

const mockRedisService = {
  get: jest.fn(),
};

const mockEventsCatalog = {
  getById: jest.fn(),
  getAll: jest.fn(),
};

const invalidEventIdRequests: [string, string][] = [
  ['ERROR_INVALID_ID', '/events/foo.bar/related'],
  ['ERROR_INVALID_ID', '/events/id<script>/related'],
  ['ERROR_ID_TOO_LONG', `/events/${'a'.repeat(129)}/related`],
];

describe('GET /events/:id/related', () => {
  let app: INestApplication;
  let testTool: TestTool;
  let events: EventData[];
  let todayConcert: EventData;

  beforeAll(async () => {
    events = setupEvents(DateTime.now().setZone('Europe/Paris'));
    todayConcert = events.find((event) => event.id === '100002')!;
    ({ app } = await setupApi(EventsModule, [
      { provide: RedisService, useValue: mockRedisService },
      { provide: EventsCatalogService, useValue: mockEventsCatalog },
    ]));
    testTool = new TestTool(app);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await testTool.destroy();
  });

  it('returns 200 with related events excluding the requested event', async () => {
    mockEventsCatalog.getById.mockResolvedValue(todayConcert);
    mockEventsCatalog.getAll.mockResolvedValue(events);

    const res = await testTool.get(`/events/${todayConcert.id}/related`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body.length).toBeLessThanOrEqual(6);
    expect(res.body.some((event: EventData) => event.id === todayConcert.id)).toBe(false);
  });

  it.each(invalidEventIdRequests)('returns 400 with %s for %s', async (expectedMessage, url) => {
    const res = await testTool.get(url, 400);

    expect(res.status).toBe(400);
    expect(res.body.message).toEqual(expect.arrayContaining([expectedMessage]));
    expect(mockEventsCatalog.getById).not.toHaveBeenCalled();
  });
});
