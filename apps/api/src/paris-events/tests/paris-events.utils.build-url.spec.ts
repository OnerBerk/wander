import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { QueryFilterDto } from '../../filters/dtos/query-filter.dto';
import { GeoDto } from '../../common-dtos/geo.dto';
import { buildParisEventUrl } from '../utils/build-paris-event-url';

const baseGeo = (): GeoDto => ({ lat: 48.8566, lng: 2.3522, radius: 5 });

const baseQuery = (overrides = {}) => plainToInstance(QueryFilterDto, { limit: 20, ...overrides });

describe('buildParisEventUrl', () => {
  it('builds URL with required geo params', () => {
    const url = buildParisEventUrl(baseGeo(), baseQuery());
    expect(url).toContain('within_distance');
    expect(url).toContain('48.8566');
    expect(url).toContain('2.3522');
    expect(url).toContain('5km');
    expect(url).toContain('limit=20');
  });

  it('adds tag conditions when tags are provided', () => {
    const url = buildParisEventUrl(baseGeo(), baseQuery({ tags: ['Concert'] }));
    expect(url).toContain('Concert');
  });

  it('adds multiple tag conditions with OR', () => {
    const url = buildParisEventUrl(baseGeo(), baseQuery({ tags: ['Concert', 'Expo'] }));
    expect(url).toContain('Concert');
    expect(url).toContain('Expo');
    expect(url).toContain('OR');
  });

  it('adds free price condition when price is free', () => {
    const url = buildParisEventUrl(baseGeo(), baseQuery({ price: 'free' }));
    expect(url).toContain('gratuit');
  });

  it('adds paid price condition when price is paid', () => {
    const url = buildParisEventUrl(baseGeo(), baseQuery({ price: 'paid' }));
    expect(url).toContain('payant');
  });

  it('does not add tag condition when tags is absent', () => {
    const url = buildParisEventUrl(baseGeo(), baseQuery());
    expect(url).not.toContain('qfap_tags');
  });

  it('does not add price condition when price is absent', () => {
    const url = buildParisEventUrl(baseGeo(), baseQuery());
    expect(url).not.toContain('price_type');
  });

  it('adds week period condition', () => {
    const url = buildParisEventUrl(baseGeo(), baseQuery({ period: 'week' }));
    expect(url).toContain('date_start%3E%3Dnow%28%29');
    expect(url).toContain('now%28days%3D7%29');
  });

  it('adds all period condition (starts after 7 days)', () => {
    const url = buildParisEventUrl(baseGeo(), baseQuery({ period: 'all' }));
    expect(url).toContain('now%28days%3D7%29');
  });
});
