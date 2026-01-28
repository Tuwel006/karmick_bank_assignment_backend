import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';
import { CreateApiGatewayDto } from './dto/create-api-gateway.dto';
import { UpdateApiGatewayDto } from './dto/update-api-gateway.dto';

@Controller('api-gateway')
export class ApiGatewayController {
  constructor(private readonly apiGatewayService: ApiGatewayService) {}

  @Post()
  create(@Body() createApiGatewayDto: CreateApiGatewayDto) {
    return this.apiGatewayService.create(createApiGatewayDto);
  }

  @Get()
  findAll() {
    return this.apiGatewayService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.apiGatewayService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateApiGatewayDto: UpdateApiGatewayDto) {
    return this.apiGatewayService.update(+id, updateApiGatewayDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.apiGatewayService.remove(+id);
  }
}
