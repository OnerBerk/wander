import { QueryFilterDto } from '../../filters/dtos/query-filter.dto';
import { getPeriodCondition } from '../../events/utils';
import { GeoDto } from '../../common-dtos/geo.dto';

const BASE_URL = 'https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records';

export const buildParisEventUrl = (geo: GeoDto, query: Partial<QueryFilterDto>): string => {
  const conditions: string[] = [getPeriodCondition(query.period)];

  conditions.push(`within_distance(lat_lon, geom'POINT(${geo.lng} ${geo.lat})', ${geo.radius}km)`);

  if (query.tags?.length) {
    const tagConditions = query.tags.map((t) => `qfap_tags like '%${t}%'`).join(' OR ');
    conditions.push(`(${tagConditions})`);
  }

  if (query.price === 'free') conditions.push(`price_type='gratuit'`);
  else if (query.price === 'paid') conditions.push(`price_type='payant'`);

  const params = new URLSearchParams({
    where: conditions.join(' AND '),
    order_by: `distance(lat_lon, geom'POINT(${geo.lng} ${geo.lat})') ASC`,
    limit: String(query.limit ?? 20),
  });

  return `${BASE_URL}?${params.toString()}`;
};
