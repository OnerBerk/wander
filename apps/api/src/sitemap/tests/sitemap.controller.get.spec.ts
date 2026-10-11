import { INestApplication } from '@nestjs/common';
import { RedisService } from '../../redis/redis.service';
import { setupApi } from '../../test-utils/setup-api';
import { TestTool } from '../../test-utils/test-tools';
import { SitemapModule } from '../sitemap.module';

const mockRedisService = {
  get: jest.fn(),
  set: jest.fn(),
};

describe('GET /sitemap.xml', () => {
  let app: INestApplication;
  let testTool: TestTool;

  beforeAll(async () => {
    ({ app } = await setupApi(SitemapModule, [{ provide: RedisService, useValue: mockRedisService }]));
    testTool = new TestTool(app);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await testTool.destroy();
  });

  it('returns 200 with the xml', async () => {
    const xml = '<urlset></urlset>';
    mockRedisService.get.mockResolvedValue(xml);

    const res = await testTool.get('/sitemap.xml');

    expect(res.status).toBe(200);
    expect(res.text).toBe(xml);
    expect(res.headers['content-type']).toContain('application/xml');
  });
});
