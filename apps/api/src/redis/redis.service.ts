import {Injectable, Logger, OnModuleDestroy} from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly client: Redis;
  private readonly logger = new Logger(RedisService.name);
  private readonly redisUrl: string;
  private hasLoggedRuntimeFallback = false;

  constructor() {
    this.redisUrl = process.env.REDIS_URL ?? 'redis://localhost:6379';
    this.client = new Redis(this.redisUrl, {
      maxRetriesPerRequest: 2,
      connectTimeout: 10_000,
      retryStrategy: (attempt) => {
        const delayMs = Math.min(attempt * 200, 2_000);
        if (attempt <= 3 || attempt % 10 === 0) {
          this.logger.warn(`Redis reconnect attempt #${attempt} in ${delayMs}ms`);
        }
        return delayMs;
      },
    });

    this.logger.log(`Redis client initialized (${this.getRedisTargetLabel()})`);

    this.client.on('connect', () => {
      this.logger.log('Redis socket connected');
    });

    this.client.on('ready', () => {
      this.hasLoggedRuntimeFallback = false;
      this.logger.log('Redis ready to accept commands');
    });

    this.client.on('reconnecting', (delayMs: number) => {
      this.logger.warn(`Redis reconnecting in ${delayMs}ms`);
    });

    this.client.on('close', () => {
      this.logger.warn('Redis connection closed');
    });

    this.client.on('end', () => {
      this.logger.error('Redis connection ended');
    });

    this.client.on('error', (err) => {
      this.logger.error(`Redis client error: ${err.message}`);
    });
  }

  onModuleDestroy() {
    void this.client.quit().catch((error: unknown) => {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.warn(`Redis quit failed: ${message}`);
    });
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.client.get(key);
      if (!data) return null;

      try {
        return JSON.parse(data) as T;
      } catch {
        this.logger.warn(`Redis get returned invalid JSON for key "${key}"`);
        return null;
      }
    } catch (error) {
      this.logRuntimeFallback('GET', key, error);
      return null;
    }
  }

  async set(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    try {
      await this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch (error) {
      this.logRuntimeFallback('SET', key, error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      this.logRuntimeFallback('DEL', key, error);
    }
  }

  private getRedisTargetLabel(): string {
    try {
      const parsed = new URL(this.redisUrl);
      return `${parsed.protocol}//${parsed.hostname}:${parsed.port || '(default)'}`;
    } catch {
      return 'invalid REDIS_URL format';
    }
  }

  private logRuntimeFallback(operation: 'GET' | 'SET' | 'DEL', key: string, error: unknown): void {
    const message = error instanceof Error ? error.message : 'Unknown error';
    if (!this.hasLoggedRuntimeFallback) {
      this.hasLoggedRuntimeFallback = true;
      this.logger.error(
        `Redis unavailable during ${operation} "${key}" (${message}). Falling back to no-cache mode.`
      );
      return;
    }

    this.logger.warn(`Redis ${operation} failed for "${key}" (${message})`);
  }
}
