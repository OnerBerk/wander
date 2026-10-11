import { EVENT_TAG_OPTIONS } from '@/constants/event-tag-options';
import { EventData } from '@wander/types';

export function slugify(text: string): string {
  const slug = text
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

  return slug || 'event';
}

export function eventPath(event: EventData): string {
  const option = EVENT_TAG_OPTIONS.find((item) => event.tags.includes(item.value));
  const categorie = slugify(option?.label ?? 'autre');
  return `/evenement/${categorie}/${slugify(event.title)}/${event.id}`;
}
