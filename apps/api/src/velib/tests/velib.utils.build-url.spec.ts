import 'reflect-metadata';
import {plainToInstance} from 'class-transformer';
import {GeoDto} from '../../common-dtos/geo.dto';
import {buildVelibUrl} from '../utils/build-velib-url';

const baseDto = (overrides = {}) =>
  plainToInstance(GeoDto, {
    lat: 48.8566,
    lng: 2.3522,
    radius: 5,
    ...overrides,
  });

describe('buildVelibUrl', () => {
  it('builds URL with required geo params', () => {
    const url = buildVelibUrl(baseDto());
    expect(url).toContain('within_distance');
    expect(url).toContain('48.8566');
    expect(url).toContain('2.3522');
    expect(url).toContain('5km');
    expect(url).toContain('limit=100');
  });

  it('uses provided radius', () => {
    const url = buildVelibUrl(baseDto({radius: 10}));
    expect(url).toContain('10km');
  });
});
