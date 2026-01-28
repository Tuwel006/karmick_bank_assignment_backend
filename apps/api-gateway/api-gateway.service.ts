import { Injectable } from '@nestjs/common';
import { CreateApiGatewayDto } from './dto/create-api-gateway.dto';
import { UpdateApiGatewayDto } from './dto/update-api-gateway.dto';

@Injectable()
export class ApiGatewayService {
  create(createApiGatewayDto: CreateApiGatewayDto) {
    return 'This action adds a new apiGateway';
  }

  findAll() {
    return `This action returns all apiGateway`;
  }

  findOne(id: number) {
    return `This action returns a #${id} apiGateway`;
  }

  update(id: number, updateApiGatewayDto: UpdateApiGatewayDto) {
    return `This action updates a #${id} apiGateway`;
  }

  remove(id: number) {
    return `This action removes a #${id} apiGateway`;
  }
}
