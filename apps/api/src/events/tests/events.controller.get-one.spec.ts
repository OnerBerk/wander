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
};

const invalidEventIdRequests: [string, string][] = [
  ['ERROR_INVALID_ID', '/events/foo.bar'],
  ['ERROR_INVALID_ID', '/events/id<script>'],
  ['ERROR_ID_TOO_LONG', `/events/${'a'.repeat(129)}`],
];

describe('GET /events/:id', () => {
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

  it('returns 200 with an EventData', async () => {
    mockEventsCatalog.getById.mockResolvedValue(todayConcert);

    const res = await testTool.get(`/events/${todayConcert.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(todayConcert);
    expect(mockEventsCatalog.getById).toHaveBeenCalledWith(todayConcert.id);
  });

  it.each(invalidEventIdRequests)('returns 400 with %s for %s', async (expectedMessage, url) => {
    const res = await testTool.get(url, 400);

    expect(res.status).toBe(400);
    expect(res.body.message).toEqual(expect.arrayContaining([expectedMessage]));
    expect(mockEventsCatalog.getById).not.toHaveBeenCalled();
  });
});
