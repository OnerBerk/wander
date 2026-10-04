export const getOptimizedImageUrl = (src: string, width: 256 | 384 | 640 | 1080): string => {
  if (import.meta.env.DEV) return src;

  return `/_vercel/image?url=${encodeURIComponent(src)}&w=${width}&q=75`;
};
