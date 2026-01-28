import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as path from 'path';

const envFile = path.resolve(__dirname, '../../../.env.' + (process.env.NODE_ENV || 'dev'));
dotenv.config({ path: envFile });

async function bootstrap() {
  const port = parseInt(process.env.USERS_SERVICE_PORT || '3002', 10);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port,
      },
    },
  );
  await app.listen();
  console.log('\n✅ Users Microservice is running on port', port, '\n');
}

bootstrap();
