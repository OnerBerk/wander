import {Module} from '@nestjs/common';
import {ParisEventsService} from './paris-events.service';
import {RedisModule} from '../redis/redis.module';
import {HttpClientModule} from '../http-client/http-client.module';

@Module({
  imports: [RedisModule, HttpClientModule],
  providers: [ParisEventsService],
  exports: [ParisEventsService],
})
export class ParisEventsModule {}
