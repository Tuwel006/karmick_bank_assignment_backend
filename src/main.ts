import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import * as path from 'path';
import * as dotenv from 'dotenv';

async function bootstrap() {
  const envMode = process.env.NODE_ENV || 'dev';
  dotenv.config({ path: path.resolve(process.cwd(), `.env.${envMode}`) });

  const app = await NestFactory.create(AppModule);

  // Accounts Microservice
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: parseInt(process.env.ACCOUNTS_SERVICE_PORT || '4001', 10),
    },
  });

  // Users Microservice
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: parseInt(process.env.USERS_SERVICE_PORT || '4002', 10),
    },
  });

  // Transactions Microservice
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: parseInt(process.env.TRANSACTIONS_SERVICE_PORT || '4003', 10),
    },
  });

  // Customer Microservice
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: parseInt(process.env.CUSTOMER_SERVICE_PORT || '4004', 10),
    },
  });

  await app.startAllMicroservices();

  const port = process.env.API_GATEWAY_PORT || 3000;
  await app.listen(port);
  console.log(`\n🚀 Monolithic backend started. Single DB connection pool active.`);
  console.log(`- API Gateway: http://localhost:${port}`);
  console.log(`- Accounts Microservice: TCP ${process.env.ACCOUNTS_SERVICE_PORT}`);
  console.log(`- Users Microservice: TCP ${process.env.USERS_SERVICE_PORT}`);
  console.log(`- Transactions Microservice: TCP ${process.env.TRANSACTIONS_SERVICE_PORT}`);
  console.log(`- Customer Microservice: TCP ${process.env.CUSTOMER_SERVICE_PORT}\n`);
}
bootstrap();
