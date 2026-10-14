import {NestFactory} from '@nestjs/core';
import {NestExpressApplication} from '@nestjs/platform-express';
import {AppModule} from './app.module.js';
import {ValidationPipe} from '@nestjs/common';
import {existsSync} from 'node:fs';
import {join} from 'node:path';
import type {Request, Response} from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const isProduction = process.env.NODE_ENV === 'production';
  app.enableCors({
    origin: isProduction ? ['https://www.wandercity.fr', 'https://wandercity.fr'] : true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    })
  );

  const coverageRoot = join(process.cwd(), 'coverage');
  if (process.env.NODE_ENV !== 'production' && existsSync(coverageRoot)) {
    const expressApp = app.getHttpAdapter().getInstance();
    expressApp.get('/coverage', (_req: Request, res: Response) => {
      const lcovIndex = join(coverageRoot, 'lcov-report', 'index.html');
      res.redirect(302, existsSync(lcovIndex) ? '/coverage/lcov-report/' : '/coverage/');
    });
    app.useStaticAssets(coverageRoot, {prefix: '/coverage/'});
  }

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
