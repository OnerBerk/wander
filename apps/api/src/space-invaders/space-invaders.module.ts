import {Module} from '@nestjs/common';
import {HttpClientModule} from '../http-client/http-client.module';
import {RedisModule} from '../redis/redis.module';
import {SpaceInvadersService} from './space-invaders.service';
import {SpaceInvadersController} from './space-invaders.controller';

@Module({
  imports: [RedisModule, HttpClientModule],
  providers: [SpaceInvadersService],
  controllers: [SpaceInvadersController],
  exports: [SpaceInvadersService],
})
export class SpaceInvadersModule {}
