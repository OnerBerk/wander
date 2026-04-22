import {Injectable, InternalServerErrorException, Logger} from '@nestjs/common';
import {WeatherData} from '@wander/types';
import {RedisService} from '../redis/redis.service';
import {HttpClientService} from '../http-client/http-client.service';
import {PARIS_COORDINATES} from '../config/constants';

const {latitude, longitude} = PARIS_COORDINATES;
const CACHE_KEY = 'weather:paris';
const CACHE_TTL = 900;

const OPEN_METEO_URL =
  `https://api.open-meteo.com/v1/forecast?latitude=${latitude}` +
  `&longitude=${longitude}` +
  `&current=temperature_2m,` +
  `precipitation,weathercode,windspeed_10m` +
  `&daily=sunrise,sunset` +
  `&timezone=Europe/Paris`;

interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    precipitation: number;
    weathercode: number;
    windspeed_10m: number;
    time: string;
  };
  daily: {
    sunrise: string[];
    sunset: string[];
  };
}

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);

  constructor(
    private readonly redisService: RedisService,
    private readonly httpClient: HttpClientService
  ) {}

  async getWeather(): Promise<WeatherData> {
    try {
      const cached = await this.redisService.get<WeatherData>(CACHE_KEY);
      this.logger.log('data', cached);

      if (cached) {
        this.logger.log('🎯 Weather cache hit');
        return cached;
      }

      const data = await this.httpClient.get<OpenMeteoResponse>(OPEN_METEO_URL);

      const weather: WeatherData = {
        temperature: data.current.temperature_2m,
        precipitation: data.current.precipitation,
        weatherCode: data.current.weathercode,
        windSpeed: data.current.windspeed_10m,
        time: data.current.time,
        sunrise: data.daily.sunrise[0],
        sunset: data.daily.sunset[0],
      };

      await this.redisService.set(CACHE_KEY, weather, CACHE_TTL);
      this.logger.log('💾 Weather cached');

      return weather;
    } catch (error) {
      this.logger.log(error);
      throw new InternalServerErrorException('Failed to fetch weather data');
    }
  }
}
