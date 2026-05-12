import 'reflect-metadata';
import {InternalServerErrorException} from '@nestjs/common';
import {SpaceInvadersService} from '../space-invaders.service';
import {RedisService} from '../../redis/redis.service';
import {InvadersOverpassElement} from '@wander/types';
import {setupUnitTest} from '../../test-utils/setup-unit-test';

const mockElement: InvadersOverpassElement = {
  type: 'node',
  id: 123456,
  lat: 48.8566,
  lon: 2.3522,
  tags: {
    artwork_type: 'mosaic',
    artist_name: 'Invader',
  },
};

const mockRedisService = {
  get: jest.fn(),
  set: jest.fn(),
};

const mockFetchResponse = (ok: boolean, data: unknown) => ({
  ok,
  status: ok ? 200 : 406,
  json: jest.fn().mockResolvedValue(data),
});

describe('SpaceInvadersService', () => {
  let service: SpaceInvadersService;

  beforeAll(async () => {
    service = await setupUnitTest(SpaceInvadersService, [{provide: RedisService, useValue: mockRedisService}]);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('cache hit', () => {
    it('returns cached data without calling fetch', async () => {
      mockRedisService.get.mockResolvedValue([mockElement]);
      const fetchSpy = jest.spyOn(global, 'fetch');

      const result = await service.getSpaceInvaders();

      expect(result).toEqual([mockElement]);
      expect(fetchSpy).not.toHaveBeenCalled();
    });
  });

  describe('cache miss', () => {
    it('calls Overpass API, caches and returns elements', async () => {
      mockRedisService.get.mockResolvedValue(null);
      jest.spyOn(global, 'fetch').mockResolvedValue(
        mockFetchResponse(true, {elements: [mockElement]}) as unknown as Response
      );

      const result = await service.getSpaceInvaders();

      expect(result).toEqual([mockElement]);
      expect(mockRedisService.set).toHaveBeenCalledWith('space-invaders', [mockElement], 172800);
    });

    it('throws InternalServerErrorException when Overpass responds with non-ok status', async () => {
      mockRedisService.get.mockResolvedValue(null);
      jest.spyOn(global, 'fetch').mockResolvedValue(
        mockFetchResponse(false, null) as unknown as Response
      );

      await expect(service.getSpaceInvaders()).rejects.toThrow(InternalServerErrorException);
    });

    it('throws InternalServerErrorException when fetch throws', async () => {
      mockRedisService.get.mockResolvedValue(null);
      jest.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'));

      await expect(service.getSpaceInvaders()).rejects.toThrow(InternalServerErrorException);
    });
  });
});
