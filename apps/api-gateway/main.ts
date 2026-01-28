import { NestFactory } from "@nestjs/core";
import { ApiGatewayModule } from "./api-gateway.module";
import * as dotenv from "dotenv";

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  const port = process.env.API_GATEWAY_PORT || 3000;
  await app.listen(port);
  console.log(`API Gateway is running on port ${port}`);
}
bootstrap();
