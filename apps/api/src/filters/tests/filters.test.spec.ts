import {validate} from 'class-validator';
import {plainToInstance} from 'class-transformer';
import {QueryFilterDto} from '../dtos/query-filter.dto';
import {QueryBuilder} from '../utils/query-builder';
import {parseFilter} from '../utils/parse-filter';

describe('QueryFilterDto', () => {
  const toDto = (obj: object) => plainToInstance(QueryFilterDto, obj);

  it('accepts valid filter string', async () => {
    const dto = toDto({filter: 'tag:Concert,price:free'});
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('rejects malformed filter string', async () => {
    const dto = toDto({filter: 'invalid'});
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('rejects limit above 100', async () => {
    const dto = toDto({limit: 999});
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('rejects negative offset', async () => {
    const dto = toDto({offset: -1});
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('accepts valid query', async () => {
    const dto = toDto({limit: 20, offset: 0, lat: 48.8566, lng: 2.3522, radius: 5});
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});

describe('parseFilter', () => {
  it('returns empty object when no filter', () => {
    expect(parseFilter(undefined)).toEqual({});
  });

  it('parses single key:value', () => {
    expect(parseFilter('tag:Concert')).toEqual({tag: 'Concert'});
  });

  it('parses multiple key:value', () => {
    expect(parseFilter('tag:Concert,price:free')).toEqual({tag: 'Concert', price: 'free'});
  });

  it('ignores unknown keys', () => {
    expect(parseFilter('unknown:value')).toEqual({});
  });

  it('ignores malformed pairs', () => {
    expect(parseFilter('invalid')).toEqual({});
  });
});

describe('QueryBuilder', () => {
  const FIELD_MAP = {
    tag: (v: string) => `qfap_tags like '%${v}%'`,
    price: (v: string) => `price_type='${v === 'free' ? 'gratuit' : 'payant'}'`,
  };

  const BASE_URL = 'https://api.test.com/records';

  it('builds URL with default params', () => {
    const dto = plainToInstance(QueryFilterDto, {limit: 10, offset: 0});
    const url = decodeURIComponent(new QueryBuilder(dto, FIELD_MAP).build(BASE_URL));
    expect(url).toContain('date_start>=now()');
    expect(url).toContain('limit=10');
    expect(url).toContain('offset=0');
  });

  it('builds URL with tag filter', () => {
    const dto = plainToInstance(QueryFilterDto, {filter: 'tag:Concert', limit: 10});
    const url = new QueryBuilder(dto, FIELD_MAP).build(BASE_URL);
    expect(url).toContain('qfap_tags+like+');
    expect(url).toContain('Concert');
  });

  it('builds URL with geo filter', () => {
    const dto = plainToInstance(QueryFilterDto, {lat: 48.8566, lng: 2.3522, radius: 5});
    const url = decodeURIComponent(new QueryBuilder(dto, FIELD_MAP).build(BASE_URL));
    expect(url).toContain('dist(lat_lon');
  });
});
