import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { DEFAULT_IMAGE_PATH, serializeJsonLd, SITE_ORIGIN } from '@/utils/event-seo';

interface SeoMetadataProps {
  title: string;
  description: string;
  canonicalPath?: string;
  imagePath?: string;
  imageAlt?: string;
  ogType?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
  noIndex?: boolean;
  jsonLd?: Record<string, unknown>;
}

const toAbsoluteUrl = (path: string): string => {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  return `${SITE_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
};

const SeoMetadata: React.FC<SeoMetadataProps> = ({
  title,
  description,
  canonicalPath,
  imagePath = DEFAULT_IMAGE_PATH,
  imageAlt = 'Wander app icon',
  ogType = 'website',
  twitterCard = 'summary',
  noIndex = false,
  jsonLd,
}) => {
  const canonicalUrl = canonicalPath ? toAbsoluteUrl(canonicalPath) : undefined;
  const imageUrl = toAbsoluteUrl(imagePath);

  useEffect(() => {
    document.head.querySelectorAll('[data-seo-default]').forEach((node) => node.remove());
  }, []);

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />
      {canonicalUrl ? <link rel="canonical" href={canonicalUrl} /> : null}

      <meta property="og:type" content={ogType} />
      {canonicalUrl ? <meta property="og:url" content={canonicalUrl} /> : null}
      <meta property="og:site_name" content="Wander" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={imageAlt} />

      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {jsonLd ? <script type="application/ld+json">{serializeJsonLd(jsonLd)}</script> : null}
    </Helmet>
  );
};

export default SeoMetadata;
