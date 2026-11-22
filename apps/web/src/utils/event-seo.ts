import type { EventData } from '@wander/types';
import { eventPath } from './event-path.js';

export const SITE_ORIGIN = 'https://www.wandercity.fr';
export const DEFAULT_IMAGE_PATH = '/web-app-manifest-512x512.png';
const DEFAULT_EVENT_DESCRIPTION = 'Événement à Paris et en Île-de-France.';
const MAX_DESCRIPTION_LENGTH = 155;

export interface EventSeoData {
  title: string;
  description: string;
  canonicalPath: string;
  canonicalUrl: string;
  imageUrl: string;
  imageAlt: string;
  twitterCard: 'summary' | 'summary_large_image';
  jsonLd: Record<string, unknown>;
}

const NAMED_HTML_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  rsquo: '’',
  lsquo: '‘',
  laquo: '«',
  raquo: '»',
  hellip: '…',
  ndash: '–',
  mdash: '—',
  euro: '€',
  eacute: 'é',
  egrave: 'è',
  ecirc: 'ê',
  agrave: 'à',
  acirc: 'â',
  ccedil: 'ç',
  ocirc: 'ô',
  ugrave: 'ù',
  ucirc: 'û',
  icirc: 'î',
  iuml: 'ï',
  oelig: 'œ',
};

export function stripHtmlToText(html: string): string {
  const withoutTags = html.replace(/<\/(p|div|li|h[1-6])>|<br\s*\/?>/gi, ' ').replace(/<[^>]*>/g, ' ');

  const decoded = withoutTags.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, entity: string) => {
    const lower = entity.toLowerCase();
    if (lower.startsWith('#x')) {
      const code = Number.parseInt(lower.slice(2), 16);
      return Number.isFinite(code) ? String.fromCodePoint(code) : match;
    }
    if (lower.startsWith('#')) {
      const code = Number.parseInt(lower.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : match;
    }
    return NAMED_HTML_ENTITIES[lower] ?? match;
  });

  return decoded.replace(/\s+/g, ' ').trim();
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const sliced = text.slice(0, maxLength - 1);
  const lastSpace = sliced.lastIndexOf(' ');
  const cut = lastSpace > maxLength * 0.6 ? sliced.slice(0, lastSpace) : sliced;
  return `${cut.trimEnd()}…`;
}

function isValidIsoDate(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  return Number.isFinite(Date.parse(trimmed));
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function serializeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replaceAll('<', '\\u003c').replaceAll('>', '\\u003e').replaceAll('&', '\\u0026');
}

function buildDescription(event: EventData): string {
  const lead = stripHtmlToText(event.leadText);
  if (lead) return truncateText(lead, MAX_DESCRIPTION_LENGTH);

  const body = event.description ? stripHtmlToText(event.description) : '';
  if (body) return truncateText(body, MAX_DESCRIPTION_LENGTH);

  return DEFAULT_EVENT_DESCRIPTION;
}

function buildPostalAddress(event: EventData): Record<string, string> | null {
  const streetAddress = event.addressStreet.trim();
  const postalCode = event.addressZipcode.trim();
  const addressLocality = event.addressCity.trim();

  if (!streetAddress && !postalCode && !addressLocality) {
    return null;
  }

  const address: Record<string, string> = {
    '@type': 'PostalAddress',
    addressCountry: 'FR',
  };

  if (streetAddress) address.streetAddress = streetAddress;
  if (postalCode) address.postalCode = postalCode;
  if (addressLocality) address.addressLocality = addressLocality;

  return address;
}

function buildEventNode(event: EventData, canonicalUrl: string, description: string): Record<string, unknown> | null {
  const name = event.title.trim();
  if (!name || !isValidIsoDate(event.dateStart)) {
    return null;
  }

  const address = buildPostalAddress(event);
  const placeName = event.addressName.trim();
  if (!address && !placeName) {
    return null;
  }

  const location: Record<string, unknown> = {
    '@type': 'Place',
    name: placeName || event.addressCity.trim() || 'Paris',
    address: address ?? {
      '@type': 'PostalAddress',
      streetAddress: placeName,
      addressCountry: 'FR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: event.location.lat,
      longitude: event.location.lng,
    },
  };

  const eventNode: Record<string, unknown> = {
    '@type': 'Event',
    '@id': `${canonicalUrl}#event`,
    name,
    description,
    startDate: event.dateStart.trim(),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    url: canonicalUrl,
    inLanguage: 'fr-FR',
    location,
  };

  if (isValidIsoDate(event.dateEnd)) {
    eventNode.endDate = event.dateEnd.trim();
  }

  if (event.coverUrl) {
    eventNode.image = [event.coverUrl];
  }

  if (event.priceType === 'free') {
    eventNode.isAccessibleForFree = true;
    eventNode.offers = {
      '@type': 'Offer',
      price: 0,
      priceCurrency: 'EUR',
      url: event.accessLink || event.url || canonicalUrl,
    };
  }

  return eventNode;
}

export function buildEventSeo(event: EventData): EventSeoData {
  const canonicalPath = eventPath(event);
  const canonicalUrl = `${SITE_ORIGIN}${canonicalPath}`;
  const title = `${event.title} | Wander`;
  const description = buildDescription(event);
  const hasCover = Boolean(event.coverUrl);
  const imageUrl = event.coverUrl || `${SITE_ORIGIN}${DEFAULT_IMAGE_PATH}`;
  const imageAlt = event.coverAlt?.trim() || event.title;
  const breadcrumbNode: Record<string, unknown> = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Accueil',
        item: `${SITE_ORIGIN}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: event.title,
        item: canonicalUrl,
      },
    ],
  };

  const eventNode = buildEventNode(event, canonicalUrl, description);
  const graph = eventNode ? [eventNode, breadcrumbNode] : [breadcrumbNode];

  return {
    title,
    description,
    canonicalPath,
    canonicalUrl,
    imageUrl,
    imageAlt,
    twitterCard: hasCover ? 'summary_large_image' : 'summary',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': graph,
    },
  };
}

function stripDefaultSeoTags(html: string): string {
  return html
    .replace(/<title\b[^>]*\bdata-seo-default\b[^>]*>[\s\S]*?<\/title>\s*/gi, '')
    .replace(/<(?:meta|link)\b[^>]*\bdata-seo-default\b[^>]*\/?>\s*/gi, '')
    .replace(/<script\b[^>]*\bdata-seo-default\b[^>]*>[\s\S]*?<\/script>\s*/gi, '');
}

function formatFallbackDate(iso: string): string {
  if (!isValidIsoDate(iso)) return '';
  try {
    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'long',
      timeZone: 'Europe/Paris',
    }).format(new Date(iso));
  } catch {
    return '';
  }
}

function buildFallbackBody(event: EventData, description: string): string {
  const dateText = formatFallbackDate(event.dateStart);
  const addressParts = [event.addressName, event.addressStreet, event.addressZipcode, event.addressCity]
    .map((part) => part.trim())
    .filter(Boolean);
  const addressText = addressParts.join(', ');

  const lines = [
    '<main>',
    `<h1>${escapeHtml(event.title)}</h1>`,
    dateText ? `<p>${escapeHtml(dateText)}</p>` : '',
    addressText ? `<p>${escapeHtml(addressText)}</p>` : '',
    `<p>${escapeHtml(description)}</p>`,
    '<a href="/">Retour aux événements</a>',
    '</main>',
  ];

  return lines.filter(Boolean).join('');
}

export function injectEventHtml(template: string, event: EventData): string {
  const seo = buildEventSeo(event);
  const cleaned = stripDefaultSeoTags(template);

  const headTags = [
    `<title data-seo-default>${escapeHtml(seo.title)}</title>`,
    `<meta data-seo-default name="description" content="${escapeHtml(seo.description)}" />`,
    `<meta data-seo-default name="robots" content="index, follow" />`,
    `<link data-seo-default rel="canonical" href="${escapeHtml(seo.canonicalUrl)}" />`,
    `<meta data-seo-default property="og:type" content="article" />`,
    `<meta data-seo-default property="og:url" content="${escapeHtml(seo.canonicalUrl)}" />`,
    `<meta data-seo-default property="og:site_name" content="Wander" />`,
    `<meta data-seo-default property="og:title" content="${escapeHtml(seo.title)}" />`,
    `<meta data-seo-default property="og:description" content="${escapeHtml(seo.description)}" />`,
    `<meta data-seo-default property="og:image" content="${escapeHtml(seo.imageUrl)}" />`,
    `<meta data-seo-default property="og:image:alt" content="${escapeHtml(seo.imageAlt)}" />`,
    `<meta data-seo-default name="twitter:card" content="${seo.twitterCard}" />`,
    `<meta data-seo-default name="twitter:title" content="${escapeHtml(seo.title)}" />`,
    `<meta data-seo-default name="twitter:description" content="${escapeHtml(seo.description)}" />`,
    `<meta data-seo-default name="twitter:image" content="${escapeHtml(seo.imageUrl)}" />`,
    `<script data-seo-default type="application/ld+json">${serializeJsonLd(seo.jsonLd)}</script>`,
  ].join('\n    ');

  const withHead = cleaned.replace('</head>', () => `    ${headTags}\n  </head>`);
  return withHead.replace(
    /<div\s+id=["']root["']\s*><\/div>/i,
    () => `<div id="root">${buildFallbackBody(event, seo.description)}</div>`,
  );
}

export function injectNotFoundEventHtml(template: string): string {
  const title = 'Événement terminé | Wander';
  const description = "Cet événement n'est plus disponible sur Wander.";
  const cleaned = stripDefaultSeoTags(template);

  const headTags = [
    `<title data-seo-default>${escapeHtml(title)}</title>`,
    `<meta data-seo-default name="description" content="${escapeHtml(description)}" />`,
    `<meta data-seo-default name="robots" content="noindex, nofollow" />`,
  ].join('\n    ');

  const withHead = cleaned.replace('</head>', () => `    ${headTags}\n  </head>`);
  return withHead.replace(
    /<div\s+id=["']root["']\s*><\/div>/i,
    () =>
      `<div id="root"><main><h1>Événement terminé</h1><p>${escapeHtml(description)}</p><a href="/">Retour aux événements</a></main></div>`,
  );
}
