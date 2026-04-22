import {INestApplication} from '@nestjs/common';
import {setupApi} from '../../test-utils/setup-api';
import {TestTool} from '../../test-utils/test-tools';

describe('GET /paris-events', () => {
  let app: INestApplication;
  let testTool: TestTool;

  beforeAll(async () => {
    ({app} = await setupApi());
    testTool = new TestTool(app);
  });

  afterAll(async () => {
    await testTool.destroy();
  });

  it('returns 200 with events list', async () => {
    const res = await testTool.get('/paris-events');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('events');
    expect(Array.isArray(res.body.events)).toBe(true);
  });

  it('returns 200 with tag filter', async () => {
    const res = await testTool.get('/paris-events?filter=tag:Concert&limit=5');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('events');
  });

  it('returns 400 with invalid limit', async () => {
    const res = await testTool.get('/paris-events?limit=999', 400);
    expect(res.status).toBe(400);
  });

  it('returns 400 with malformed filter', async () => {
    const res = await testTool.get('/paris-events?filter=invalid', 400);
    expect(res.status).toBe(400);
  });
});
