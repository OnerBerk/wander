import {INestApplication} from '@nestjs/common';
import request, {Response} from 'supertest';

export class TestTool {
  constructor(private readonly app: INestApplication) {}

  async get(url: string, expectedStatus = 200): Promise<Response> {
    return request(this.app.getHttpServer()).get(url).expect(expectedStatus);
  }

  async destroy(): Promise<void> {
    await this.app.close();
  }
}
