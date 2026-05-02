import 'reflect-metadata';
import {plainToInstance} from 'class-transformer';
import {InternalServerErrorException} from '@nestjs/common';
import {VelibService} from '../velib.service';
import {RedisService} from '../../redis/redis.service';
import {HttpClientService} from '../../http-client/http-client.service';
import {VelibStation} from '@wander/types';
import {setupUnitTest} from '../../test-utils/setup-unit-test';
import {GeoDto} from '../../common-dtos/geo.dto';

const mockStation: VelibStation = {
  id: '5110',
  name: 'Test Station',
  capacity: 23,
  bikesAvailable: 10,
  docksAvailable: 13,
  mechanical: 5,
  ebike: 5,
  isRenting: true,
  isReturning: true,
  location: {lat: 48.8566, lng: 2.3522},
};

const mockRawStation = {
  stationcode: '5110',
  name: 'Test Station',
  is_installed: 'OUI' as const,
  capacity: 23,
  numdocksavailable: 13,
  numbikesavailable: 10,
  mechanical: 5,
  ebike: 5,
  is_renting: 'OUI' as const,
  is_returning: 'OUI' as const,
  duedate: '2026-05-02T12:00:00+00:00',
  coordonnees_geo: {lat: 48.8566, lon: 2.3522},
  nom_arrondissement_communes: 'Paris',
  code_insee_commune: '75056',
  station_opening_hours: null,
};

const mockApiResponse = {
  total_count: 1,
  results: [mockRawStation],
};

const mockRedisService = {
  get: jest.fn(),
  set: jest.fn(),
};

const mockHttpClient = {
  get: jest.fn(),
};

describe('VelibService', () => {
  let service: VelibService;

  beforeAll(async () => {
    service = await setupUnitTest(VelibService, [
      {provide: RedisService, useValue: mockRedisService},
      {provide: HttpClientService, useValue: mockHttpClient},
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const dto = plainToInstance(GeoDto, {lat: 48.8566, lng: 2.3522, radius: 5});

  describe('cache hit', () => {
    it('returns cached data without calling API', async () => {
      mockRedisService.get.mockResolvedValue([mockStation]);

      const result = await service.getStations(dto);

      expect(result).toEqual([mockStation]);
      expect(mockHttpClient.get).not.toHaveBeenCalled();
    });
  });

  describe('cache miss', () => {
    it('calls API, maps response and caches result', async () => {
      mockRedisService.get.mockResolvedValue(null);
      mockHttpClient.get.mockResolvedValue(mockApiResponse);

      const result = await service.getStations(dto);

      expect(result).toEqual([mockStation]);
      expect(mockRedisService.set).toHaveBeenCalledTimes(1);
    });

    it('filters out stations with null coordinates', async () => {
      mockRedisService.get.mockResolvedValue(null);
      mockHttpClient.get.mockResolvedValue({
        total_count: 2,
        results: [mockRawStation, {...mockRawStation, coordonnees_geo: null}],
      });

      const result = await service.getStations(dto);

      expect(result).toHaveLength(1);
    });

    it('maps NON values to false', async () => {
      mockRedisService.get.mockResolvedValue(null);
      mockHttpClient.get.mockResolvedValue({
        total_count: 1,
        results: [{...mockRawStation, is_renting: 'NON', is_returning: 'NON'}],
      });

      const result = await service.getStations(dto);

      expect(result[0].isRenting).toBe(false);
      expect(result[0].isReturning).toBe(false);
    });
  });

  describe('error', () => {
    it('throws InternalServerErrorException when API fails', async () => {
      mockRedisService.get.mockResolvedValue(null);
      mockHttpClient.get.mockRejectedValue(new Error('Network error'));

      await expect(service.getStations(dto)).rejects.toThrow(InternalServerErrorException);
    });
  });
});
