import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { QueryFilterDto } from '../dtos/query-filter.dto';

describe('QueryFilterDto', () => {
  const toDto = (obj: object) => plainToInstance(QueryFilterDto, obj);

  it('accepts valid query with tag and price', async () => {
    const dto = toDto({ tags: ['Concert'], price: 'free', limit: 20 });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('accepts literature tag with accent', async () => {
    const dto = toDto({ tags: ['Littérature'] });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('rejects invalid price', async () => {
    const dto = toDto({ price: 'invalid' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('rejects limit above 100', async () => {
    const dto = toDto({ limit: 999 });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('accepts valid period', async () => {
    const dto = toDto({ period: 'week' });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('rejects invalid period', async () => {
    const dto = toDto({ period: 'year' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('accepts empty query', async () => {
    const dto = toDto({});
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
