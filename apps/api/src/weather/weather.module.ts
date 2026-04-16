import {Module} from '@nestjs/common';
import {WeatherService} from './weather.service';
import {WeatherController} from './weather.controller';
import {RedisModule} from '../redis/redis.module';
import {HttpClientModule} from '../http-client/http-client.module';

@Module({
  imports: [RedisModule, HttpClientModule],
  providers: [WeatherService],
  controllers: [WeatherController],
})
export class WeatherModule {}
