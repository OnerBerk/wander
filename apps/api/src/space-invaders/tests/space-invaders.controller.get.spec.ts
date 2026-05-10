import {INestApplication} from '@nestjs/common';
import {setupApi} from '../../test-utils/setup-api';
import {TestTool} from '../../test-utils/test-tools';

describe('GET /space-invaders', () => {
  let app: INestApplication;
  let testTool: TestTool;

  beforeAll(async () => {
    ({app} = await setupApi());
    testTool = new TestTool(app);
  });

  afterAll(async () => {
    await testTool.destroy();
  });

  it('returns 200 with an array', async () => {
    const res = await testTool.get('/space-invaders');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
