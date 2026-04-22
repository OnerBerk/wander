import {Module} from '@nestjs/common';
import {RedisModule} from './redis/redis.module';
import {WeatherModule} from './weather/weather.module';
import {ParisEventsModule} from './paris-events/paris-events.module';

@Module({
  imports: [RedisModule, WeatherModule, ParisEventsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
