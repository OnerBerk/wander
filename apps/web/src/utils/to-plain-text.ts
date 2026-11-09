export const toPlainText = (html: string): string => {
  const withBreaks = html.replace(/<\/(p|div|li)>|<br\s*\/?>/gi, ' ');
  const text = new DOMParser().parseFromString(withBreaks, 'text/html').body.textContent ?? '';
  return text.replace(/\s+/g, ' ').trim();
};
