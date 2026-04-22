import {FieldMapper} from '../../paris-events/local-types/paris-events.types';
import {QueryFilterDto} from '../dtos/query-filter.dto';
import {parseFilter} from './parse-filter';

export class QueryBuilder {
  private conditions: string[] = ['date_start>=now()'];
  private params: Record<string, string> = {};

  constructor(
    private readonly query: QueryFilterDto,
    private readonly fieldMap: FieldMapper
  ) {}

  build(baseUrl: string): string {
    const filters = parseFilter(this.query.filter);

    Object.entries(filters).forEach(([key, value]) => {
      const mapper = this.fieldMap[key];
      if (mapper) this.conditions.push(mapper(value));
    });

    if (this.query.lat && this.query.lng && this.query.radius) {
      this.conditions.push(`dist(lat_lon, geom'POINT(${this.query.lng} ${this.query.lat})', ${this.query.radius}km)<1`);
    }

    const urlParams = new URLSearchParams({
      where: this.conditions.join(' AND '),
      order_by: 'date_start ASC',
      limit: String(this.query.limit ?? 20),
      offset: String(this.query.offset ?? 0),
      ...this.params,
    });

    return `${baseUrl}?${urlParams.toString()}`;
  }
}
