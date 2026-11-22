import { Module } from '@nestjs/common';
import { RedisModule } from '../redis/redis.module';
import { ParisEventsModule } from '../paris-events/paris-events.module';
import { SitemapModule } from '../sitemap/sitemap.module';
import { IngestionService } from './ingestion.service';
import { IngestionController } from './ingestion.controller';

@Module({
  imports: [RedisModule, ParisEventsModule, SitemapModule],
  providers: [IngestionService],
  controllers: [IngestionController],
})
export class IngestionModule {}
