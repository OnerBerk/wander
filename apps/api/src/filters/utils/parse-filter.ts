type FilterRecord = Record<string, string>;

const ALLOWED_KEYS = new Set(['tag', 'price', 'city', 'indoor']);

export const parseFilter = (filter?: string): FilterRecord => {
  if (!filter) return {};

  return filter.split(',').reduce<FilterRecord>((acc, pair) => {
    const [key, value] = pair.split(':');
    if (key && value && ALLOWED_KEYS.has(key)) {
      acc[key] = value.trim();
    }
    return acc;
  }, {});
};
