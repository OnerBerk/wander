import type { EventData } from '@wander/types';
import { EVENT_TAG_LABELS } from '../constants/event-tag-labels.js';

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

export function eventCategoryLabel(event: Pick<EventData, 'tags'>): string {
  const option = EVENT_TAG_LABELS.find((item) => event.tags.includes(item.value));
  return option?.label ?? 'Autre';
}

export function eventPath(event: Pick<EventData, 'id' | 'title' | 'tags'>): string {
  const categorie = slugify(eventCategoryLabel(event));
  return `/event/${categorie}/${slugify(event.title)}/${event.id}`;
}

export function eventBackPath(state: unknown): '/' | '/map' {
  if (typeof state === 'object' && state !== null && 'from' in state && state.from === '/map') {
    return '/map';
  }
  return '/';
}
