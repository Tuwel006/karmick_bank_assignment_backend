import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MESSAGE_PATTERNS } from '@/utils/constants/MESSAGE_PATTERNS';

@Controller('migration')
export class MigrationController {
  constructor(
    @Inject('MIGRATION_SERVICE') private client: ClientProxy,
  ) {}

  @Post()
  create(@Body() data: any) {
    return this.client.send(
      MESSAGE_PATTERNS.migration.CREATE,
      data,
    );
  }

  @Get()
  findAll() {
    return this.client.send(MESSAGE_PATTERNS.migration.FIND_ALL, {});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.client.send(MESSAGE_PATTERNS.migration.FIND_ONE, { id });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.client.send(MESSAGE_PATTERNS.migration.UPDATE, {
      id,
      ...data,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.client.send(MESSAGE_PATTERNS.migration.DELETE, { id });
  }
}
