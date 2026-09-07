import { Module } from '@nestjs/common';
import { RedisModule } from './redis/redis.module';
import { WeatherModule } from './weather/weather.module';
import { EventsModule } from './events/events.module';
import { VelibModule } from './velib/velib.module';
import { IngestionModule } from './ingestion/ingestion.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AiModule } from './A.I/ai.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    RedisModule,
    WeatherModule,
    EventsModule,
    VelibModule,
    IngestionModule,
    AiModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
