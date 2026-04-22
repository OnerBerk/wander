import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module.js';
import {ValidationPipe} from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    })
  );
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
