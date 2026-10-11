import { Module } from '@nestjs/common';
import { RedisModule } from '../redis/redis.module';
import { SitemapController } from './sitemap.controller';
import { SitemapService } from './sitemap.service';

@Module({
  imports: [RedisModule],
  controllers: [SitemapController],
  providers: [SitemapService],
})
export class SitemapModule {}
