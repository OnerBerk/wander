import { Module } from '@nestjs/common';
import { RedisModule } from './redis/redis.module';
import { WeatherModule } from './weather/weather.module';
import { EventsModule } from './events/events.module';
import { VelibModule } from './velib/velib.module';
import { SpaceInvadersModule } from './space-invaders/space-invaders.module';
import { IngestionModule } from './ingestion/ingestion.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    RedisModule,
    WeatherModule,
    EventsModule,
    VelibModule,
    SpaceInvadersModule,
    IngestionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
