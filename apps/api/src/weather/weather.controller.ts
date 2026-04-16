import {Controller, Get} from '@nestjs/common';
import {WeatherService} from './weather.service';
import {WeatherData} from '@wander/types';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  async getWeather(): Promise<WeatherData> {
    return this.weatherService.getWeather();
  }
}
