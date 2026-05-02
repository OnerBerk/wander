import {Module} from '@nestjs/common';
import {EventsController} from './events.controller';
import {EventsService} from './events.service';
import {ParisEventsModule} from '../paris-events/paris-events.module';

@Module({
  imports: [ParisEventsModule],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
