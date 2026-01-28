import { PartialType } from '@nestjs/mapped-types';
import { CreateApiGatewayDto } from './create-api-gateway.dto';

export class UpdateApiGatewayDto extends PartialType(CreateApiGatewayDto) {}
