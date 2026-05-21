import {INestApplication} from '@nestjs/common';
import {WeatherData} from '@wander/types';
import {RedisService} from '../../redis/redis.service';
import {HttpClientService} from '../../http-client/http-client.service';
import {setupApi} from '../../test-utils/setup-api';
import {TestTool} from '../../test-utils/test-tools';

const mockWeatherData: WeatherData = {
  temperature: 18.9,
  precipitation: 0,
  weatherCode: 2,
  windSpeed: 6.9,
  time: '2026-04-16T16:15',
  sunrise: '2026-04-16T06:30',
  sunset: '2026-04-16T20:45',
};

const mockOpenMeteoResponse = {
  current: {
    temperature_2m: 18.9,
    precipitation: 0,
    weathercode: 2,
    windspeed_10m: 6.9,
    time: '2026-04-16T16:15',
  },
  daily: {
    sunrise: ['2026-04-16T06:30'],
    sunset: ['2026-04-16T20:45'],
  },
};

const mockRedisService = {
  get: jest.fn(),
  set: jest.fn(),
};

const mockHttpClient = {
  get: jest.fn(),
};

describe('GET /weather', () => {
  let app: INestApplication;
  let testTool: TestTool;

  beforeAll(async () => {
    ({app} = await setupApi([
      {provide: RedisService, useValue: mockRedisService},
      {provide: HttpClientService, useValue: mockHttpClient},
    ]));
    testTool = new TestTool(app);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await testTool.destroy();
  });

  it('retourne 200 avec les données en cache', async () => {
    mockRedisService.get
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(mockWeatherData);

    const res = await testTool.get('/weather');

    expect(res.body).toEqual(mockWeatherData);
    expect(mockHttpClient.get).not.toHaveBeenCalled();
  });

  it('retourne 200 après appel Open-Meteo si cache vide', async () => {
    mockRedisService.get.mockResolvedValue(null);
    mockHttpClient.get.mockResolvedValue(mockOpenMeteoResponse);

    const res = await testTool.get('/weather');

    expect(res.body).toEqual(mockWeatherData);
    expect(mockHttpClient.get).toHaveBeenCalledTimes(1);
  });
});
