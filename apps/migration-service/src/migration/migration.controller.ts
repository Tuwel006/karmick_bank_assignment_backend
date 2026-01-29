import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MESSAGE_PATTERNS } from '@/utils/constants/MESSAGE_PATTERNS';
import { MigrationService } from './migration.service';
import { CreateMigrationDto } from './dto/create-migration.dto';
import { UpdateMigrationDto } from './dto/update-migration.dto';

@Controller()
export class MigrationController {
  constructor(private readonly migrationService: MigrationService) {}

  @MessagePattern(MESSAGE_PATTERNS.migration.CREATE)
  create(@Payload() createMigrationDto: CreateMigrationDto) {
    return this.migrationService.create(createMigrationDto);
  }

  @MessagePattern(MESSAGE_PATTERNS.migration.FIND_ALL)
  findAll() {
    return this.migrationService.findAll();
  }

  @MessagePattern(MESSAGE_PATTERNS.migration.FIND_ONE)
  findOne(@Payload() data: any) {
    return this.migrationService.findOne(data.id);
  }

  @MessagePattern(MESSAGE_PATTERNS.migration.UPDATE)
  update(@Payload() data: any) {
    return this.migrationService.update(data.id, data);
  }

  @MessagePattern(MESSAGE_PATTERNS.migration.DELETE)
  remove(@Payload() data: any) {
    return this.migrationService.remove(data.id);
  }
}
