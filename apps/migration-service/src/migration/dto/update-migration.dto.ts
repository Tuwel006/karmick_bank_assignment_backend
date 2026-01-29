import { PartialType } from '@nestjs/mapped-types';
import { CreateMigrationDto } from './create-migration.dto';

export class UpdateMigrationDto extends PartialType(CreateMigrationDto) {}
