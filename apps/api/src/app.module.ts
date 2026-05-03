import {Module} from '@nestjs/common';
import {RedisModule} from './redis/redis.module';
import {WeatherModule} from './weather/weather.module';
import {EventsModule} from './events/events.module';
import {VelibModule} from './velib/velib.module';

@Module({
  imports: [RedisModule, WeatherModule, EventsModule, VelibModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
