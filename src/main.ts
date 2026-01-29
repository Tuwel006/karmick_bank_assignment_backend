import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import * as path from 'path';
import * as dotenv from 'dotenv';

async function bootstrap() {
  const envMode = process.env.NODE_ENV || 'dev';
  dotenv.config({ path: path.resolve(process.cwd(), `.env.${envMode}`) });

  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
