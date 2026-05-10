import {INestApplication} from '@nestjs/common';
import {Test} from '@nestjs/testing';
import {InvadersOverpassElement} from '@wander/types';
import {SpaceInvadersController} from '../space-invaders.controller';
import {SpaceInvadersService} from '../space-invaders.service';
import {TestTool} from '../../test-utils/test-tools';

const mockElement: InvadersOverpassElement = {
  type: 'node',
  id: 1,
  lat: 48.8566,
  lon: 2.3522,
  tags: {artwork_type: 'mosaic', artist_name: 'Invader'},
};

describe('GET /space-invaders', () => {
  let app: INestApplication;
  let testTool: TestTool;
  const getSpaceInvaders = jest.fn().mockResolvedValue([mockElement]);

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [SpaceInvadersController],
      providers: [{provide: SpaceInvadersService, useValue: {getSpaceInvaders}}],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    testTool = new TestTool(app);
  });

  afterAll(async () => {
    await testTool.destroy();
  });

  it('returns 200 with an array from the service', async () => {
    const res = await testTool.get('/space-invaders');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toEqual([mockElement]);
    expect(getSpaceInvaders).toHaveBeenCalledTimes(1);
  });
});
