
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
    ) { }

    create(createRoleDto: any) {
        const role = this.roleRepository.create(createRoleDto);
        return this.roleRepository.save(role);
    }

    findAll() {
        return this.roleRepository.find();
    }

    findOne(id: string) {
        return this.roleRepository.findOneBy({ id });
    }

    update(id: string, updateRoleDto: any) {
        return this.roleRepository.update(id, updateRoleDto);
    }

    remove(id: string) {
        return this.roleRepository.delete(id);
    }
}
