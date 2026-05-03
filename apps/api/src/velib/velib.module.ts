import {Module} from '@nestjs/common';
import {VelibService} from './velib.service';
import {RedisModule} from '../redis/redis.module';
import {HttpClientModule} from '../http-client/http-client.module';
import {VelibController} from './velib.controller';

@Module({
  imports: [RedisModule, HttpClientModule],
  controllers: [VelibController],
  providers: [VelibService],
})
export class VelibModule {}
