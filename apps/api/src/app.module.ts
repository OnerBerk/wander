import {Module} from '@nestjs/common';
import {RedisModule} from './redis/redis.module';
import {WeatherModule} from './weather/weather.module';
import {EventsModule} from './events/events.module';

@Module({
  imports: [RedisModule, WeatherModule, EventsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
