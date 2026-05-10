import {Module} from '@nestjs/common';
import {RedisModule} from './redis/redis.module';
import {WeatherModule} from './weather/weather.module';
import {EventsModule} from './events/events.module';
import {VelibModule} from './velib/velib.module';
import {SpaceInvadersModule} from './space-invaders/space-invaders.module';

@Module({
  imports: [RedisModule, WeatherModule, EventsModule, VelibModule, SpaceInvadersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
