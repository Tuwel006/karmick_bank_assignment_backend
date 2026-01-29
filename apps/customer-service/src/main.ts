import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: parseInt(process.env.CUSTOMER_SERVICE_PORT || '4004', 10),
      },
    },
  );
  await app.listen();
  console.log('Customer microservice is listening');
}

bootstrap();
