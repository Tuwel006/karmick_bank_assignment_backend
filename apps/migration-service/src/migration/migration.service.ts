import { Injectable } from '@nestjs/common';
import { CreateMigrationDto } from './dto/create-migration.dto';
import { UpdateMigrationDto } from './dto/update-migration.dto';

@Injectable()
export class MigrationService {
  create(createMigrationDto: CreateMigrationDto) {
    return 'This action adds a new migration';
  }

  findAll() {
    return `This action returns all migration`;
  }

  findOne(id: number) {
    return `This action returns a #${id} migration`;
  }

  update(id: number, updateMigrationDto: UpdateMigrationDto) {
    return `This action updates a #${id} migration`;
  }

  remove(id: number) {
    return `This action removes a #${id} migration`;
  }
}
