import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { IngestionController } from '../ingestion.controller';
import { IngestionService } from '../ingestion.service';
import { TestTool } from '../../test-utils/test-tools';

describe('POST /ingestion/run', () => {
  let app: INestApplication;
  let testTool: TestTool;
  const runIngestion = jest.fn().mockResolvedValue(undefined);

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [IngestionController],
      providers: [{ provide: IngestionService, useValue: { runIngestion } }],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    testTool = new TestTool(app);
  });

  afterAll(async () => {
    await testTool.destroy();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('triggers ingestion and returns ok', async () => {
    const res = await request(app.getHttpServer()).post('/ingestion/run').expect(201);

    expect(res.body).toEqual({ ok: true });
    expect(runIngestion).toHaveBeenCalledTimes(1);
  });
});
