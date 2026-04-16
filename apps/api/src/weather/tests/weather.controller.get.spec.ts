import {INestApplication} from '@nestjs/common';
import {TestTool} from '../../test-utils/test-tools';
import {setupApi} from '../../test-utils/setup-api';

describe('GET /weather', () => {
  let app: INestApplication;
  let testTool: TestTool;

  beforeAll(async () => {
    ({app} = await setupApi());
    testTool = new TestTool(app);
  });

  afterAll(async () => {
    await testTool.destroy();
  });

  it('retourne 200 avec les données météo', async () => {
    const res = await testTool.get('/weather');
    expect(res.body).toHaveProperty('temperature');
  });
});
