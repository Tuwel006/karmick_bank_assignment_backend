
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemModule } from './entities/system-module.entity';

@Injectable()
export class SystemModulesService {
    constructor(
        @InjectRepository(SystemModule)
        private readonly systemModuleRepository: Repository<SystemModule>,
    ) { }

    create(createDto: any) {
        const module = this.systemModuleRepository.create(createDto);
        return this.systemModuleRepository.save(module);
    }

    findAll() {
        return this.systemModuleRepository.find();
    }

    findOne(id: string) {
        return this.systemModuleRepository.findOneBy({ id });
    }

    update(id: string, updateDto: any) {
        return this.systemModuleRepository.update(id, updateDto);
    }

    remove(id: string) {
        return this.systemModuleRepository.delete(id);
    }
}
