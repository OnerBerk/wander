import {QueryFilterDto} from '../../filters/dtos/query-filter.dto';

const BASE_URL = 'https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records';

export const buildParisEventUrl = (query: QueryFilterDto): string => {
  const conditions: string[] = ['date_start>=now()'];

  if (query.tag) conditions.push(`qfap_tags like '%${query.tag}%'`);
  if (query.price === 'free') conditions.push(`price_type='gratuit'`);
  else if (query.price === 'paid') conditions.push(`price_type='payant'`);

  const params = new URLSearchParams({
    where: conditions.join(' AND '),
    order_by: 'date_start ASC',
    limit: String(query.limit ?? 20),
    'geofilter.distance': `${query.lat},${query.lng},${query.radius * 1000}`,
  });

  return `${BASE_URL}?${params.toString()}`;
};
