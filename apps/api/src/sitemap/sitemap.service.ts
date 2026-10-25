import { Injectable } from '@nestjs/common';
import { EventData, EventTag } from '@wander/types';
import { RedisService } from '../redis/redis.service';
import { EventsCatalogService } from '../paris-events/events-catalog.service';

const SITEMAP_REDIS_KEY = 'sitemap:xml';
const SITEMAP_TTL_SECONDS = 12 * 60 * 60;
const SITEMAP_URL_LIMIT = 50_000;
const SITE_ORIGIN = 'https://www.wandercity.fr';

const TAG_LABELS: { value: EventTag; label: string }[] = [
  { value: 'Art contemporain', label: 'Art' },
  { value: 'Théâtre', label: 'Théâtre' },
  { value: 'Enfants', label: 'Enfants' },
  { value: 'Brocante', label: 'Brocante' },
  { value: 'Photo', label: 'Photo' },
  { value: 'Santé', label: 'Santé' },
  { value: 'Street-art', label: 'Street-art' },
  { value: 'Concert', label: 'Concert' },
  { value: 'Expo', label: 'Expo' },
  { value: 'Festival', label: 'Festival' },
  { value: 'Gourmand', label: 'Gourmand' },
  { value: 'Histoire', label: 'Histoire' },
  { value: 'Littérature', label: 'Littérature' },
  { value: 'Loisirs', label: 'Loisirs' },
  { value: 'Nature', label: 'Nature' },
  { value: 'Spectacle musical', label: 'Musique' },
  { value: 'BD', label: 'BD' },
  { value: 'Sciences', label: 'Sciences' },
  { value: 'Sport', label: 'Sport' },
  { value: 'Conférence', label: 'Conférence' },
];

const STATIC_PAGES: { path: string; changefreq: string; priority: string }[] = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/about', changefreq: 'monthly', priority: '0.6' },
  { path: '/map', changefreq: 'weekly', priority: '0.8' },
];

function slugify(text: string): string {
  const slug = text
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

  return slug || 'event';
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function eventPath(event: EventData): string {
  const option = TAG_LABELS.find((item) => event.tags.includes(item.value));
  const categorie = slugify(option?.label ?? 'autre');
  return `/event/${categorie}/${slugify(event.title)}/${event.id}`;
}

function buildSitemap(events: EventData[]): string {
  const staticUrls = STATIC_PAGES.map(
    (page) =>
      `  <url>\n    <loc>${SITE_ORIGIN}${page.path}</loc>\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority}</priority>\n  </url>`,
  );
  const eventUrls = events.slice(0, SITEMAP_URL_LIMIT - STATIC_PAGES.length).map((event) => {
    const loc = escapeXml(`${SITE_ORIGIN}${eventPath(event)}`);
    return `  <url>\n    <loc>${loc}</loc>\n  </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...staticUrls, ...eventUrls].join('\n')}\n</urlset>\n`;
}

@Injectable()
export class SitemapService {
  constructor(
    private readonly redisService: RedisService,
    private readonly eventsCatalog: EventsCatalogService,
  ) {}

  async getSitemap(): Promise<string> {
    const cached = await this.redisService.get<string>(SITEMAP_REDIS_KEY);
    if (cached) return cached;

    const events = await this.eventsCatalog.getAll();
    const xml = buildSitemap(events ?? []);
    if (events?.length) {
      await this.redisService.set(SITEMAP_REDIS_KEY, xml, SITEMAP_TTL_SECONDS);
    }
    return xml;
  }
}
