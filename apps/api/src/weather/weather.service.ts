import {Injectable, InternalServerErrorException, Logger, ServiceUnavailableException} from '@nestjs/common';
import {WeatherData} from '@wander/types';
import {RedisService} from '../redis/redis.service';
import {HttpClientService} from '../http-client/http-client.service';
import {PARIS_COORDINATES} from '../config/constants';

const {latitude, longitude} = PARIS_COORDINATES;
const CACHE_KEY = 'weather:paris';
const STALE_CACHE_KEY = 'weather:paris:stale';
const COOLDOWN_KEY = 'weather:paris:cooldown';
const CACHE_TTL = 900;
const STALE_CACHE_TTL = 3600;
const RATE_LIMIT_COOLDOWN_TTL = 60;

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
    const staleCached = await this.redisService.get<WeatherData>(STALE_CACHE_KEY);
    const isCooldownActive = await this.redisService.get<boolean>(COOLDOWN_KEY);

    if (isCooldownActive) {
      if (staleCached) {
        this.logger.warn('⚠️ Weather cooldown active, serving stale cached weather');
        return staleCached;
      }
      throw new ServiceUnavailableException('Weather temporarily unavailable (rate limited)');
    }

    try {
      const cached = await this.redisService.get<WeatherData>(CACHE_KEY);
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
      await this.redisService.set(STALE_CACHE_KEY, weather, STALE_CACHE_TTL);
      this.logger.log('💾 Weather cached');

      return weather;
    } catch (error) {
      if (this.isRateLimitError(error)) {
        await this.redisService.set(COOLDOWN_KEY, true, RATE_LIMIT_COOLDOWN_TTL);
        this.logger.warn('⚠️ Weather API rate limited, enabling temporary cooldown');
      }

      if (staleCached) {
        this.logger.warn('⚠️ Weather API unavailable, serving stale cached weather');
        return staleCached;
      }

      this.logger.log(error);
      throw new InternalServerErrorException('Failed to fetch weather data');
    }
  }

  private isRateLimitError(error: unknown): boolean {
    if (!(error instanceof Error)) return false;
    return error.message.includes('429');
  }
}
