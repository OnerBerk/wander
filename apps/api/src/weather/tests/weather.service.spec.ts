import {InternalServerErrorException} from '@nestjs/common';
import {WeatherService} from '../weather.service';
import {RedisService} from '../../redis/redis.service';
import {HttpClientService} from '../../http-client/http-client.service';
import {WeatherData} from '@wander/types';
import {setupUnitTest} from '../../test-utils/setup-unit-test';

const mockWeatherData: WeatherData = {
  temperature: 18.9,
  precipitation: 0,
  weatherCode: 2,
  windSpeed: 6.9,
  time: '2026-04-16T16:15',
};

const mockOpenMeteoResponse = {
  current: {
    temperature_2m: 18.9,
    precipitation: 0,
    weathercode: 2,
    windspeed_10m: 6.9,
    time: '2026-04-16T16:15',
  },
};

const mockRedisService = {
  get: jest.fn(),
  set: jest.fn(),
};

const mockHttpClient = {
  get: jest.fn(),
};

describe('WeatherService', () => {
  let service: WeatherService;

  beforeAll(async () => {
    service = await setupUnitTest(WeatherService, [
      {provide: RedisService, useValue: mockRedisService},
      {provide: HttpClientService, useValue: mockHttpClient},
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('cache hit', () => {
    it('retourne les données du cache sans appeler Open-Meteo', async () => {
      mockRedisService.get.mockResolvedValue(mockWeatherData);

      const result = await service.getWeather();

      expect(result).toEqual(mockWeatherData);
      expect(mockHttpClient.get).not.toHaveBeenCalled();
      expect(mockRedisService.set).not.toHaveBeenCalled();
    });
  });

  describe('cache miss', () => {
    it('appelle Open-Meteo, transforme la réponse et met en cache', async () => {
      mockRedisService.get.mockResolvedValue(null);
      mockHttpClient.get.mockResolvedValue(mockOpenMeteoResponse);

      const result = await service.getWeather();

      expect(result).toEqual(mockWeatherData);
      expect(mockHttpClient.get).toHaveBeenCalledTimes(1);
      expect(mockRedisService.set).toHaveBeenCalledWith('weather:paris', mockWeatherData, 900);
    });
  });

  describe('erreur', () => {
    it('lance InternalServerErrorException si Open-Meteo échoue', async () => {
      mockRedisService.get.mockResolvedValue(null);
      mockHttpClient.get.mockRejectedValue(new Error('Network error'));

      await expect(service.getWeather()).rejects.toThrow(InternalServerErrorException);
    });
  });
});
