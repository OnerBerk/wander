import {INestApplication} from '@nestjs/common';
import {setupApi} from '../../test-utils/setup-api';
import {TestTool} from '../../test-utils/test-tools';

const invalidRequests: [string, string][] = [
  ['/paris-events', 'missing lat lng radius'],
  ['/paris-events?lat=48.8566&lng=2.3522&radius=5&limit=999', 'limit too high'],
  ['/paris-events?lng=2.3522&radius=5', 'missing lat'],
  ['/paris-events?lat=48.8566&radius=5', 'missing lng'],
  ['/paris-events?lat=48.8566&lng=2.3522', 'missing radius'],
];

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

  it('returns 200 with valid params', async () => {
    const res = await testTool.get('/paris-events?lat=48.8566&lng=2.3522&radius=5&limit=5');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('events');
    expect(Array.isArray(res.body.events)).toBe(true);
  });

  it.each(invalidRequests)('returns 400 for %s (%s)', async (url) => {
    const res = await testTool.get(url, 400);
    expect(res.status).toBe(400);
  });
});
