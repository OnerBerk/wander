import {Test, TestingModule} from '@nestjs/testing';
import {WeatherData} from '@wander/types';
import {WeatherService} from '../weather.service';
import {HttpClientService} from '../../http-client/http-client.service';
import {RedisService} from '../../redis/redis.service';

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

describe('WeatherService', () => {
  let service: WeatherService;
  let redisService: jest.Mocked<RedisService>;
  let httpClient: jest.Mocked<HttpClientService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        {
          provide: RedisService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
        {
          provide: HttpClientService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<WeatherService>(WeatherService);
    redisService = module.get(RedisService);
    httpClient = module.get(HttpClientService);
  });

  it('returns the cached weather data when it exists', async () => {
    redisService.get.mockResolvedValue(mockWeatherData);

    const result = await service.getWeather();

    expect(result).toEqual(mockWeatherData);
    expect(httpClient.get).not.toHaveBeenCalled();
  });

  it('calls Open-Meteo and caches the data when the cache is empty', async () => {
    redisService.get.mockResolvedValue(null);
    httpClient.get.mockResolvedValue(mockOpenMeteoResponse);

    const result = await service.getWeather();

    expect(result).toEqual(mockWeatherData);
    expect(httpClient.get).toHaveBeenCalledTimes(1);
    expect(redisService.set).toHaveBeenCalledWith('weather:paris', mockWeatherData, 900);
  });

  it('propagates the error if Open-Meteo fails', async () => {
    redisService.get.mockResolvedValue(null);
    httpClient.get.mockRejectedValue(new Error('External API error'));

    await expect(service.getWeather()).rejects.toThrow('External API error');
  });
});
