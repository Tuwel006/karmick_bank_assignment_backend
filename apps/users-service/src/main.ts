import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = parseInt(process.env.USERS_SERVICE_PORT || '4002', 10);
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
