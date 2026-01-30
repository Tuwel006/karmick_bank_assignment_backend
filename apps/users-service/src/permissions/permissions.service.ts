
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionsService {
    constructor(
        @InjectRepository(Permission)
        private readonly permissionRepository: Repository<Permission>,
    ) { }

    create(createDto: any) {
        const permission = this.permissionRepository.create(createDto);
        return this.permissionRepository.save(permission);
    }

    findAll() {
        return this.permissionRepository.find({ relations: ['role', 'systemModule'] });
    }

    findOne(id: string) {
        return this.permissionRepository.findOne({
            where: { id },
            relations: ['role', 'systemModule']
        });
    }

    update(id: string, updateDto: any) {
        return this.permissionRepository.update(id, updateDto);
    }

    remove(id: string) {
        return this.permissionRepository.delete(id);
    }
}
