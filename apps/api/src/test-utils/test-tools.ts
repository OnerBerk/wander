import {INestApplication} from '@nestjs/common';
import request, {Response} from 'supertest';

export class TestTool {
  constructor(private readonly app: INestApplication) {}

  async get(url: string, expectedStatus = 200): Promise<Response> {
    return request(this.app.getHttpServer()).get(url).expect(expectedStatus);
  }

  async post(url: string, body: object, expectedStatus = 201): Promise<Response> {
    return request(this.app.getHttpServer()).post(url).send(body).expect(expectedStatus);
  }

  async destroy(): Promise<void> {
    await this.app.close();
  }
}
