import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RedisService } from '../redis/redis.service';
import { ParisEventsService } from '../paris-events/paris-events.service';
import { IDF_ZONES } from '../geo-zones/idf/idf.zones';
import { EventData } from '@wander/types';

const PERIODS = ['week', 'all'] as const;
const STAGING_KEY = 'events:en-cours';
const ACTIVE_KEY = 'events:actifs';
const DELAY_BETWEEN_REQUESTS_MS = 5000;

@Injectable()
export class IngestionService {
  private readonly logger = new Logger(IngestionService.name);

  constructor(
    private readonly redisService: RedisService,
    private readonly parisEventsService: ParisEventsService,
  ) {}

  @Cron(CronExpression.EVERY_12_HOURS)
  async runIngestion(): Promise<void> {
    this.logger.log('🚀 Ingestion démarrée');

    const eventsMap = new Map<string, EventData>();
    let hasError = false;

    for (const zone of IDF_ZONES) {
      for (const period of PERIODS) {
        try {
          const events = await this.parisEventsService.fetchEventsByZone(zone.lat, zone.lng, zone.radiusKm, period);

          for (const event of events) {
            eventsMap.set(event.id, event);
          }

          this.logger.log(`✅ ${zone.label} [${period}] — ${events.length} events`);
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unknown error';
          this.logger.error(`❌ ${zone.label} [${period}] — ${message}`);
          hasError = true;
        }

        await this.delay(DELAY_BETWEEN_REQUESTS_MS);
      }
    }

    if (hasError) {
      this.logger.warn('⚠️ Ingestion terminée avec des erreurs — base non mise à jour');
      return;
    }

    const events = Array.from(eventsMap.values());

    try {
      await this.redisService.setPersist(STAGING_KEY, events);
      await this.redisService.rename(STAGING_KEY, ACTIVE_KEY);
      this.logger.log(`💾 Ingestion terminée — ${events.length} events uniques en base`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`❌ Échec du swap Redis — ${message}`);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
