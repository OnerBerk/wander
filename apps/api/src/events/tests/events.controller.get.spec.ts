import { INestApplication } from '@nestjs/common';
import { setupApi } from '../../test-utils/setup-api';
import { TestTool } from '../../test-utils/test-tools';

const invalidRequests: [string, string][] = [['/events?limit=999', 'limit too high']];

describe('GET /events', () => {
  let app: INestApplication;
  let testTool: TestTool;

  beforeAll(async () => {
    ({ app } = await setupApi());
    testTool = new TestTool(app);
  });

  afterAll(async () => {
    await testTool.destroy();
  });

  it('returns 200 with no params', async () => {
    const res = await testTool.get('/events');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('returns 200 with optional filters', async () => {
    const res = await testTool.get('/events?period=week&limit=5');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it.each(invalidRequests)('returns 400 for %s (%s)', async (url) => {
    const res = await testTool.get(url, 400);
    expect(res.status).toBe(400);
  });
});
