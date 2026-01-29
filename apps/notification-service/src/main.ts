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
        port: parseInt(process.env.NOTIFICATION_SERVICE_PORT || '4007', 10),
      },
    },
  );
  await app.listen();
  console.log('Notification microservice is listening');
}

bootstrap();
