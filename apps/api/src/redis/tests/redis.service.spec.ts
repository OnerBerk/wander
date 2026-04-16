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

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [RedisService],
    }).compile();

    service = module.get<RedisService>(RedisService);
    errorCallback = mockRedisClient.on.mock.calls.find((call: [string, unknown]) => call[0] === 'error')?.[1] as (
      err: Error
    ) => void;
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
});
