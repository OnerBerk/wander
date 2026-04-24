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
    expect(url).toContain('date_start%3E%3Dnow');
    expect(url).toContain('geofilter.distance=48.8566%2C2.3522%2C5000');
    expect(url).toContain('limit=20');
  });

  it('adds tag condition when tag is provided', () => {
    const url = buildParisEventUrl(baseDto({tag: 'Concert'}));
    expect(url).toContain('Concert');
  });

  it('adds free price condition when price is free', () => {
    const url = buildParisEventUrl(baseDto({price: 'free'}));
    expect(url).toContain('gratuit');
  });

  it('adds paid price condition when price is paid', () => {
    const url = buildParisEventUrl(baseDto({price: 'paid'}));
    expect(url).toContain('payant');
  });

  it('does not add tag condition when tag is absent', () => {
    const url = buildParisEventUrl(baseDto());
    expect(url).not.toContain('qfap_tags');
  });

  it('does not add price condition when price is absent', () => {
    const url = buildParisEventUrl(baseDto());
    expect(url).not.toContain('price_type');
  });

  it('converts radius from km to meters for geofilter', () => {
    const url = buildParisEventUrl(baseDto({radius: 10}));
    expect(url).toContain('10000');
  });
});
