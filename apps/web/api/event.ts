import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { EventData } from '@wander/types';
import { eventPath } from '../src/utils/event-path.js';
import { injectEventHtml, injectNotFoundEventHtml } from '../src/utils/event-seo.js';

const EVENT_ID_PATTERN = /^[a-zA-Z0-9_-]{1,128}$/;
const API_TIMEOUT_MS = 5_000;
const RELATED_TIMEOUT_MS = 2_000;
const API_BASE_URL = (process.env.API_URL ?? process.env.VITE_API_URL ?? 'https://api.wandercity.fr').replace(
  /\/+$/,
  '',
);

const HTML_HEADERS = { 'Content-Type': 'text/html; charset=utf-8' } as const;
const CACHE_FOUND = 'public, s-maxage=3600, stale-while-revalidate=86400';
const CACHE_NOT_FOUND = 'public, s-maxage=300, stale-while-revalidate=600';

let templatePromise: Promise<string | null> | null = null;

async function readTemplateFromDisk(): Promise<string | null> {
  const candidates = [
    join(process.cwd(), 'dist', 'index.html'),
    join(process.cwd(), 'apps', 'web', 'dist', 'index.html'),
    join(process.cwd(), 'index.html'),
  ];

  for (const filePath of candidates) {
    try {
      return await readFile(filePath, 'utf-8');
    } catch {
      continue;
    }
  }

  return null;
}

function loadHtmlTemplate(): Promise<string | null> {
  templatePromise ??= readTemplateFromDisk().then((html) => {
    if (!html) templatePromise = null;
    return html;
  });
  return templatePromise;
}

type FetchEventResult = { status: 'found'; event: EventData } | { status: 'not_found' } | { status: 'error' };

async function fetchEvent(id: string): Promise<FetchEventResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${encodeURIComponent(id)}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });

    if (response.status === 404) return { status: 'not_found' };
    if (!response.ok) return { status: 'error' };

    const raw = await response.text();
    if (!raw.trim()) return { status: 'not_found' };

    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || !('id' in parsed) || !('title' in parsed)) {
      return { status: 'not_found' };
    }

    return { status: 'found', event: parsed as EventData };
  } catch {
    return { status: 'error' };
  }
}

async function fetchRelatedEvents(id: string): Promise<EventData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${encodeURIComponent(id)}/related`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(RELATED_TIMEOUT_MS),
    });

    if (!response.ok) return [];

    const parsed: unknown = await response.json();
    return Array.isArray(parsed) ? (parsed as EventData[]) : [];
  } catch {
    return [];
  }
}

export async function GET(request: Request): Promise<Response> {
  const template = await loadHtmlTemplate();
  if (!template) {
    console.error('[api/event] dist/index.html introuvable');
    return new Response(null, {
      status: 503,
      headers: { 'Retry-After': '60', 'Cache-Control': 'no-store' },
    });
  }

  const { searchParams } = new URL(request.url);
  const categorie = searchParams.get('categorie') ?? '';
  const slug = searchParams.get('slug') ?? '';
  const id = searchParams.get('id') ?? '';

  if (!EVENT_ID_PATTERN.test(id)) {
    return new Response(injectNotFoundEventHtml(template), {
      status: 404,
      headers: { ...HTML_HEADERS, 'Cache-Control': CACHE_NOT_FOUND },
    });
  }

  const [result, relatedEvents] = await Promise.all([fetchEvent(id), fetchRelatedEvents(id)]);

  if (result.status === 'error') {
    return new Response(template, {
      status: 503,
      headers: { ...HTML_HEADERS, 'Retry-After': '60', 'Cache-Control': 'no-store' },
    });
  }

  if (result.status === 'not_found') {
    return new Response(injectNotFoundEventHtml(template), {
      status: 404,
      headers: { ...HTML_HEADERS, 'Cache-Control': CACHE_NOT_FOUND },
    });
  }

  const canonicalPath = eventPath(result.event);
  if (`/event/${categorie}/${slug}/${id}` !== canonicalPath) {
    return new Response(null, {
      status: 301,
      headers: { Location: canonicalPath, 'Cache-Control': CACHE_FOUND },
    });
  }

  return new Response(injectEventHtml(template, result.event, relatedEvents), {
    status: 200,
    headers: { ...HTML_HEADERS, 'Cache-Control': CACHE_FOUND },
  });
}

export async function HEAD(request: Request): Promise<Response> {
  const response = await GET(request);
  return new Response(null, { status: response.status, headers: response.headers });
}
