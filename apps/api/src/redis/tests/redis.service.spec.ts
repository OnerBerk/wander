import {Test} from '@nestjs/testing';
import {RedisService} from '../redis.service';

const mockRedisClient = {
  on: jest.fn(),
  quit: jest.fn(),
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
};

jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => mockRedisClient);
});

describe('RedisService', () => {
  let service: RedisService;
  let errorCallback: (err: Error) => void;
  let readyCallback: () => void;
  let retryStrategy: (attempt: number) => number;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [RedisService],
    }).compile();

    service = module.get<RedisService>(RedisService);
    errorCallback = mockRedisClient.on.mock.calls.find((call: [string, unknown]) => call[0] === 'error')?.[1] as (
      err: Error
    ) => void;
    readyCallback = mockRedisClient.on.mock.calls.find((call: [string, unknown]) => call[0] === 'ready')?.[1] as () => void;
    retryStrategy = mockRedisClient.on.mock.calls.length >= 0 ? (jest.requireMock('ioredis').mock.calls[0][1].retryStrategy as (attempt: number) => number) : () => 0;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('returns null when key does not exist', async () => {
      mockRedisClient.get.mockResolvedValue(null);
      const result = await service.get('key');
      expect(result).toBeNull();
    });

    it('returns parsed value when key exists', async () => {
      mockRedisClient.get.mockResolvedValue(JSON.stringify({foo: 'bar'}));
      const result = await service.get<{foo: string}>('key');
      expect(result).toEqual({foo: 'bar'});
    });

    it('returns null when cached JSON is invalid', async () => {
      mockRedisClient.get.mockResolvedValue('not-json');
      await expect(service.get('key')).resolves.toBeNull();
    });
  });

  describe('set', () => {
    it('serializes and stores with TTL', async () => {
      await service.set('key', {foo: 'bar'}, 60);
      expect(mockRedisClient.set).toHaveBeenCalledWith('key', JSON.stringify({foo: 'bar'}), 'EX', 60);
    });
  });

  describe('del', () => {
    it('deletes the key', async () => {
      await service.del('key');
      expect(mockRedisClient.del).toHaveBeenCalledWith('key');
    });
  });

  describe('error', () => {
    it('logs error when Redis emits an error event', () => {
      expect(errorCallback).toBeDefined();
      expect(() => errorCallback(new Error('Redis error'))).not.toThrow();
    });
  });

  describe('fallback behavior', () => {
    it('returns null when get fails instead of throwing', async () => {
      mockRedisClient.get.mockRejectedValue(new Error('Connection is closed'));

      await expect(service.get('key')).resolves.toBeNull();
    });

    it('does not throw when set or del fails', async () => {
      mockRedisClient.set.mockRejectedValue(new Error('Connection is closed'));
      mockRedisClient.del.mockRejectedValue(new Error('Connection is closed'));

      await expect(service.set('key', {foo: 'bar'}, 60)).resolves.toBeUndefined();
      await expect(service.del('key')).resolves.toBeUndefined();
    });
  });

  describe('configuration and lifecycle', () => {
    it('uses bounded retry delay strategy', () => {
      expect(retryStrategy(1)).toBe(200);
      expect(retryStrategy(15)).toBe(2000);
    });

    it('handles quit errors without throwing', async () => {
      mockRedisClient.quit.mockRejectedValueOnce(new Error('quit failed'));
      expect(() => service.onModuleDestroy()).not.toThrow();
      await Promise.resolve();
    });

    it('returns invalid label for malformed redis URL helper', () => {
      const helper = (service as unknown as {getRedisTargetLabel: () => string; redisUrl: string});
      helper.redisUrl = '::::';
      expect(helper.getRedisTargetLabel()).toBe('invalid REDIS_URL format');
    });

    it('resets runtime fallback flag on ready callback', async () => {
      mockRedisClient.get.mockRejectedValueOnce(new Error('Connection is closed'));
      await service.get('key');
      expect((service as unknown as {hasLoggedRuntimeFallback: boolean}).hasLoggedRuntimeFallback).toBe(true);
      readyCallback();
      expect((service as unknown as {hasLoggedRuntimeFallback: boolean}).hasLoggedRuntimeFallback).toBe(false);
    });
  });
});
