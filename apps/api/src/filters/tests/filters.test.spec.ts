import {validate} from 'class-validator';
import {plainToInstance} from 'class-transformer';
import {QueryFilterDto} from '../dtos/query-filter.dto';

describe('QueryFilterDto', () => {
  const toDto = (obj: object) => plainToInstance(QueryFilterDto, obj);

  const validGeo = {lat: 48.8566, lng: 2.3522, radius: 5};

  it('accepts valid query with tag and price', async () => {
    const dto = toDto({...validGeo, tag: 'Concert', price: 'free', limit: 20});
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('rejects invalid price', async () => {
    const dto = toDto({...validGeo, price: 'invalid'});
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('rejects limit above 100', async () => {
    const dto = toDto({...validGeo, limit: 999});
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('rejects missing geo fields', async () => {
    const dto = toDto({limit: 20, tag: 'Concert'});
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('accepts valid query with geo and limit only', async () => {
    const dto = toDto({...validGeo, limit: 20});
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
