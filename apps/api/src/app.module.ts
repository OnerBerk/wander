import {Module} from '@nestjs/common';
import {RedisModule} from './redis/redis.module';
import {WeatherModule} from './weather/weather.module';

@Module({
  imports: [RedisModule, WeatherModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
