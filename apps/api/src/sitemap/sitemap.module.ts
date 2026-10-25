import { Module } from '@nestjs/common';
import { RedisModule } from '../redis/redis.module';
import { ParisEventsModule } from '../paris-events/paris-events.module';
import { SitemapController } from './sitemap.controller';
import { SitemapService } from './sitemap.service';

@Module({
  imports: [RedisModule, ParisEventsModule],
  controllers: [SitemapController],
  providers: [SitemapService],
})
export class SitemapModule {}
