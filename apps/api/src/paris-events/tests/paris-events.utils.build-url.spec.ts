import 'reflect-metadata';
import {plainToInstance} from 'class-transformer';
import {QueryFilterDto} from '../../filters/dtos/query-filter.dto';
import {buildParisEventUrl} from '../utils/build-paris-event-url';

const baseDto = (overrides = {}) =>
  plainToInstance(QueryFilterDto, {
    lat: 48.8566,
    lng: 2.3522,
    radius: 5,
    limit: 20,
    ...overrides,
  });

describe('buildParisEventUrl', () => {
  it('builds URL with required geo params', () => {
    const url = buildParisEventUrl(baseDto());
    expect(url).toContain('within_distance');
    expect(url).toContain('48.8566');
    expect(url).toContain('2.3522');
    expect(url).toContain('5km');
    expect(url).toContain('limit=20');
  });

  it('adds tag conditions when tags are provided', () => {
    const url = buildParisEventUrl(baseDto({tags: ['Concert']}));
    expect(url).toContain('Concert');
  });

  it('adds multiple tag conditions with OR', () => {
    const url = buildParisEventUrl(baseDto({tags: ['Concert', 'Expo']}));
    expect(url).toContain('Concert');
    expect(url).toContain('Expo');
    expect(url).toContain('OR');
  });

  it('adds free price condition when price is free', () => {
    const url = buildParisEventUrl(baseDto({price: 'free'}));
    expect(url).toContain('gratuit');
  });

  it('adds paid price condition when price is paid', () => {
    const url = buildParisEventUrl(baseDto({price: 'paid'}));
    expect(url).toContain('payant');
  });

  it('does not add tag condition when tags is absent', () => {
    const url = buildParisEventUrl(baseDto());
    expect(url).not.toContain('qfap_tags');
  });

  it('does not add price condition when price is absent', () => {
    const url = buildParisEventUrl(baseDto());
    expect(url).not.toContain('price_type');
  });

  it('adds week period condition by default frontend value', () => {
    const url = buildParisEventUrl(baseDto({period: 'week'}));
    expect(url).toContain('date_start%3E%3Dnow%28%29');
    expect(url).toContain('now%28days%3D7%29');
  });

  it('adds today period condition when period is today', () => {
    const url = buildParisEventUrl(baseDto({period: 'today'}));
    expect(url).toContain('now%28days%3D1%29');
  });

  it('adds month period condition when period is month', () => {
    const url = buildParisEventUrl(baseDto({period: 'month'}));
    expect(url).toContain('now%28months%3D1%29');
  });
});
