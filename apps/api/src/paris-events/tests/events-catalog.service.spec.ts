import 'reflect-metadata';
import { EventData } from '@wander/types';
import { EventsCatalogService } from '../events-catalog.service';
import { RedisService } from '../../redis/redis.service';
import { setupUnitTest } from '../../test-utils/setup-unit-test';

const MAX_AGE_MS = 12 * 60 * 60 * 1000;
const RETRY_AFTER_MS = 15 * 60 * 1000;

const eventA: EventData = {
  id: 'a',
  title: 'A',
  leadText: '',
  description: null,
  dateStart: '2099-01-01T00:00:00+00:00',
  dateEnd: '2099-01-01T02:00:00+00:00',
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
};

const eventB: EventData = { ...eventA, id: 'b', title: 'B' };

const mockRedisService = {
  get: jest.fn(),
};

describe('EventsCatalogService', () => {
  describe('cold start', () => {
    let service: EventsCatalogService;

    beforeAll(async () => {
      service = await setupUnitTest(EventsCatalogService, [{ provide: RedisService, useValue: mockRedisService }]);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('does not keep a null first load', async () => {
      mockRedisService.get.mockResolvedValueOnce(null).mockResolvedValueOnce([eventA]);

      await expect(service.getAll()).resolves.toEqual([]);
      await expect(service.getAll()).resolves.toEqual([eventA]);

      expect(mockRedisService.get).toHaveBeenCalledTimes(2);
      expect(mockRedisService.get).toHaveBeenCalledWith('events:actifs');
    });
  });

  describe('loaded catalog', () => {
    let service: EventsCatalogService;

    beforeAll(async () => {
      service = await setupUnitTest(EventsCatalogService, [{ provide: RedisService, useValue: mockRedisService }]);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('serves the next read from memory', async () => {
      mockRedisService.get.mockResolvedValueOnce([eventA]);
      await service.invalidate();

      const calls = mockRedisService.get.mock.calls.length;
      await expect(service.getAll()).resolves.toEqual([eventA]);
      await expect(service.getById('a')).resolves.toEqual(eventA);

      expect(mockRedisService.get).toHaveBeenCalledTimes(calls);
    });

    it('reloads after invalidate only when Redis returns an array', async () => {
      mockRedisService.get.mockResolvedValueOnce([eventA]);
      await service.invalidate();

      mockRedisService.get.mockResolvedValueOnce(null);
      await service.invalidate();
      await expect(service.getAll()).resolves.toEqual([eventA]);

      mockRedisService.get.mockResolvedValueOnce([]);
      await service.invalidate();
      await expect(service.getAll()).resolves.toEqual([]);
      await expect(service.getById('a')).resolves.toBeNull();
    });
  });

  describe('concurrent callers', () => {
    let service: EventsCatalogService;

    beforeAll(async () => {
      service = await setupUnitTest(EventsCatalogService, [{ provide: RedisService, useValue: mockRedisService }]);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('shares one Redis read between concurrent callers', async () => {
      let release: (value: EventData[]) => void = () => {
        throw new Error('redis get was not called');
      };
      mockRedisService.get.mockImplementation(
        () =>
          new Promise<EventData[]>((resolve) => {
            release = resolve;
          }),
      );

      const first = service.getAll();
      const second = service.getById('a');
      await Promise.resolve();

      expect(mockRedisService.get).toHaveBeenCalledTimes(1);
      release([eventA]);

      await expect(first).resolves.toEqual([eventA]);
      await expect(second).resolves.toEqual(eventA);
      expect(mockRedisService.get).toHaveBeenCalledTimes(1);
    });
  });

  describe('reload after 12h', () => {
    let service: EventsCatalogService;

    beforeAll(async () => {
      service = await setupUnitTest(EventsCatalogService, [{ provide: RedisService, useValue: mockRedisService }]);
    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.useRealTimers();
    });

    it('keeps the previous copy when the reload fails and retries after 15 minutes', async () => {
      jest.useFakeTimers({ now: 1_000_000 });
      mockRedisService.get.mockResolvedValueOnce([eventA]);
      await service.getAll();

      jest.advanceTimersByTime(MAX_AGE_MS);
      mockRedisService.get.mockResolvedValueOnce(null);
      await expect(service.getAll()).resolves.toEqual([eventA]);
      await expect(service.getAll()).resolves.toEqual([eventA]);
      expect(mockRedisService.get).toHaveBeenCalledTimes(2);

      jest.advanceTimersByTime(RETRY_AFTER_MS);
      mockRedisService.get.mockResolvedValueOnce([eventB]);
      await expect(service.getAll()).resolves.toEqual([eventB]);
      expect(mockRedisService.get).toHaveBeenCalledTimes(3);
    });
  });
});
