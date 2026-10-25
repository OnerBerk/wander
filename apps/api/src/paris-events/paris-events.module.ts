import {Module} from '@nestjs/common';
import {ParisEventsService} from './paris-events.service';
import {EventsCatalogService} from './events-catalog.service';
import {RedisModule} from '../redis/redis.module';
import {HttpClientModule} from '../http-client/http-client.module';

@Module({
  imports: [RedisModule, HttpClientModule],
  providers: [ParisEventsService, EventsCatalogService],
  exports: [ParisEventsService, EventsCatalogService],
})
export class ParisEventsModule {}
