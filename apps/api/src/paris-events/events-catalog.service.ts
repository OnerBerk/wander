import { Injectable } from '@nestjs/common';
import { EventData } from '@wander/types';
import { RedisService } from '../redis/redis.service';

const EVENTS_REDIS_KEY = 'events:actifs';
const MAX_AGE_MS = 12 * 60 * 60 * 1000;
const RETRY_AFTER_MS = 15 * 60 * 1000;

/**
 * Copie mémoire de `events:actifs`.
 *
 * La clé Redis pèse 4 à 6 Mo. La relire à chaque requête a dépassé les 10 Go
 * de bande passante Upstash. Redis reste la copie durable, écrite par
 * l'ingestion. Les lectures (liste, fiche, outil IA, sitemap) passent ici.
 *
 * Un processus charge la clé une fois. Elle est relue au plus toutes les 12 h,
 * et juste après `invalidate()` (fin d'ingestion). Si cette relecture échoue,
 * l'ancienne copie reste servie et le prochain essai attend 15 min. Un échec
 * au premier chargement n'est pas mémorisé : la requête suivante réessaie.
 * Deux lectures simultanées partagent le même appel Redis.
 */
@Injectable()
export class EventsCatalogService {
  private events: EventData[] | null = null;
  private byId = new Map<string, EventData>();
  private loadedAt = 0;
  private retryAt = 0;
  private refreshDue = false;
  private queue: Promise<void> = Promise.resolve();

  constructor(private readonly redisService: RedisService) {}

  /** Catalogue complet. Déclenche le chargement Redis seulement s'il manque ou s'il a plus de 12 h. */
  async getAll(): Promise<EventData[]> {
    await this.enqueue(false);
    return this.events ?? [];
  }

  /** Même chargement que `getAll`, puis une recherche par id. */
  async getById(id: string): Promise<EventData | null> {
    await this.enqueue(false);
    return this.byId.get(id) ?? null;
  }

  /** À appeler après l'ingestion. Relit Redis et ne remplace la copie que si la réponse est un tableau. */
  async invalidate(): Promise<void> {
    this.refreshDue = true;
    await this.enqueue(true);
  }

  private enqueue(force: boolean): Promise<void> {
    const run = this.queue.then(async () => {
      if (!force && this.hasFreshCopy()) return;
      await this.readFromRedis();
    });
    this.queue = run.then(
      () => undefined,
      () => undefined,
    );
    return run;
  }

  private hasFreshCopy(): boolean {
    if (!this.events) return false;
    const now = Date.now();
    if (now < this.retryAt) return true;
    if (this.refreshDue) return false;
    return now - this.loadedAt < MAX_AGE_MS;
  }

  private async readFromRedis(): Promise<void> {
    let data: EventData[] | null = null;
    try {
      data = await this.redisService.get<EventData[]>(EVENTS_REDIS_KEY);
    } catch {
      data = null;
    }

    if (!Array.isArray(data)) {
      if (this.events) this.retryAt = Date.now() + RETRY_AFTER_MS;
      return;
    }

    this.events = data;
    this.byId = new Map(data.map((event) => [event.id, event]));
    this.loadedAt = Date.now();
    this.retryAt = 0;
    this.refreshDue = false;
  }
}
