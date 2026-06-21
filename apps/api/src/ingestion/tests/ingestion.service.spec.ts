import 'reflect-metadata';
import { EventData } from '@wander/types';
import { IngestionService } from '../ingestion.service';
import { RedisService } from '../../redis/redis.service';
import { ParisEventsService } from '../../paris-events/paris-events.service';
import { setupUnitTest } from '../../test-utils/setup-unit-test';

jest.mock('../../geo-zones/idf/idf.zones', () => ({
  IDF_ZONES: [{ id: 'test-zone', label: 'Test Zone', lat: 48.85, lng: 2.35, radiusKm: 5 }],
}));

const makeEvent = (id: string): EventData => ({
  id,
  title: `Event ${id}`,
  leadText: '',
  description: null,
  dateStart: '2099-01-01T00:00:00+00:00',
  dateEnd: '2099-01-02T00:00:00+00:00',
  occurrences: null,
  location: { lat: 48.85, lng: 2.35 },
  coverUrl: null,
  coverAlt: null,
  priceType: 'free',
  priceDetail: null,
  tags: ['Concert'],
  url: '',
  addressName: '',
  addressStreet: '',
  addressZipcode: '',
  addressCity: '',
  audience: null,
  isIndoor: true,
  petsAllowed: false,
  contactUrl: null,
  contactPhone: null,
  accessType: null,
  accessLink: null,
});

const mockRedisService = {
  setPersist: jest.fn(),
  rename: jest.fn(),
};

const mockParisEventsService = {
  fetchEventsByZone: jest.fn(),
};

describe('IngestionService', () => {
  let service: IngestionService;

  beforeAll(async () => {
    service = await setupUnitTest(IngestionService, [
      { provide: RedisService, useValue: mockRedisService },
      { provide: ParisEventsService, useValue: mockParisEventsService },
    ]);
  });

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  const runIngestion = async (): Promise<void> => {
    const promise = service.runIngestion();
    await jest.runAllTimersAsync();
    await promise;
  };

  it('persists deduplicated events when all zone fetches succeed', async () => {
    const event1 = makeEvent('1');
    const event2 = makeEvent('2');
    mockParisEventsService.fetchEventsByZone
      .mockResolvedValueOnce([event1])
      .mockResolvedValueOnce([event1, event2]);
    mockRedisService.setPersist.mockResolvedValue(undefined);
    mockRedisService.rename.mockResolvedValue(undefined);

    await runIngestion();

    expect(mockParisEventsService.fetchEventsByZone).toHaveBeenCalledTimes(2);
    expect(mockParisEventsService.fetchEventsByZone).toHaveBeenCalledWith(48.85, 2.35, 5, 'week');
    expect(mockParisEventsService.fetchEventsByZone).toHaveBeenCalledWith(48.85, 2.35, 5, 'all');
    expect(mockRedisService.setPersist).toHaveBeenCalledWith('events:en-cours', [event1, event2]);
    expect(mockRedisService.rename).toHaveBeenCalledWith('events:en-cours', 'events:actifs');
  });

  it('does not update Redis when a zone fetch fails', async () => {
    mockParisEventsService.fetchEventsByZone.mockRejectedValue(new Error('API down'));

    await runIngestion();

    expect(mockRedisService.setPersist).not.toHaveBeenCalled();
    expect(mockRedisService.rename).not.toHaveBeenCalled();
  });

  it('does not update Redis when a zone fetch fails with a non-Error value', async () => {
    mockParisEventsService.fetchEventsByZone.mockRejectedValue('API down');

    await runIngestion();

    expect(mockRedisService.setPersist).not.toHaveBeenCalled();
    expect(mockRedisService.rename).not.toHaveBeenCalled();
  });

  it('logs swap failure without throwing when Redis rename fails', async () => {
    mockParisEventsService.fetchEventsByZone.mockResolvedValue([makeEvent('1')]);
    mockRedisService.setPersist.mockResolvedValue(undefined);
    mockRedisService.rename.mockRejectedValue(new Error('rename failed'));

    await expect(runIngestion()).resolves.toBeUndefined();
    expect(mockRedisService.setPersist).toHaveBeenCalled();
  });

  it('logs swap failure without throwing when Redis rename fails with a non-Error value', async () => {
    mockParisEventsService.fetchEventsByZone.mockResolvedValue([makeEvent('1')]);
    mockRedisService.setPersist.mockResolvedValue(undefined);
    mockRedisService.rename.mockRejectedValue('rename failed');

    await expect(runIngestion()).resolves.toBeUndefined();
  });
});
