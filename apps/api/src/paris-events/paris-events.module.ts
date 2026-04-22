import {Module} from '@nestjs/common';
import {ParisEventsController} from './paris-events.controller';
import {ParisEventsService} from './paris-events.service';
import {RedisModule} from '../redis/redis.module';
import {HttpClientModule} from '../http-client/http-client.module';

@Module({
  imports: [RedisModule, HttpClientModule],
  controllers: [ParisEventsController],
  providers: [ParisEventsService],
})
export class ParisEventsModule {}
