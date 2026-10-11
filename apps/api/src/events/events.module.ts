import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { ParisEventsModule } from '../paris-events/paris-events.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [ParisEventsModule, RedisModule],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
