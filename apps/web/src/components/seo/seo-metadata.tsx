import { Helmet } from 'react-helmet-async';

const SITE_ORIGIN = 'https://www.wandercity.fr';
const DEFAULT_IMAGE_PATH = '/web-app-manifest-512x512.png';

interface SeoMetadataProps {
  title: string;
  description: string;
  canonicalPath?: string;
  imagePath?: string;
  noIndex?: boolean;
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
  canonicalPath = '/',
  imagePath = DEFAULT_IMAGE_PATH,
  noIndex = false,
}) => {
  const canonicalUrl = toAbsoluteUrl(canonicalPath);
  const imageUrl = toAbsoluteUrl(imagePath);

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Wander" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content="Wander app icon" />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
};

export default SeoMetadata;
