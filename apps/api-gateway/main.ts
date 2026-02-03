import * as dotenv from "dotenv";
import * as path from "path";

const envMode = process.env.NODE_ENV || 'dev';
dotenv.config({ path: path.resolve(process.cwd(), `.env.${envMode}`) });

import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from '@nestjs/common';
import { ApiGatewayModule } from "./api-gateway.module";
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { GlobalExceptionFilter } from '@/shared/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  app.enableCors();
  
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  
  app.useGlobalFilters(new GlobalExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Karmick Bank API')
    .setDescription('Professional Banking System API with comprehensive error handling and pagination')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Branch Management', 'Branch operations and management')
    .addTag('User Management', 'User operations and management')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.API_GATEWAY_PORT || 4000;
  await app.listen(port);
  console.log(`🚀 API Gateway is running on http://localhost:${port}`);
  console.log(`📚 Swagger documentation available at http://localhost:${port}/api`);
}
bootstrap();
