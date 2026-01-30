
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemModulesService } from './system-modules.service';
import { SystemModulesController } from './system-modules.controller';
import { SystemModule } from './entities/system-module.entity';

@Module({
    imports: [TypeOrmModule.forFeature([SystemModule])],
    controllers: [SystemModulesController],
    providers: [SystemModulesService],
    exports: [SystemModulesService],
})
export class SystemModulesModule { }
