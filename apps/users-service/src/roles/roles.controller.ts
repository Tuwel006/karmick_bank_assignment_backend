
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RolesService } from './roles.service';

@Controller()
export class RolesController {
    constructor(private readonly rolesService: RolesService) { }

    @MessagePattern('roles.create')
    create(@Payload() createRoleDto: any) {
        return this.rolesService.create(createRoleDto);
    }

    @MessagePattern('roles.find_all')
    findAll() {
        return this.rolesService.findAll();
    }

    @MessagePattern('roles.find_one')
    findOne(@Payload() data: { id: string }) {
        return this.rolesService.findOne(data.id);
    }

    @MessagePattern('roles.update')
    update(@Payload() data: any) {
        return this.rolesService.update(data.id, data);
    }

    @MessagePattern('roles.delete')
    remove(@Payload() data: { id: string }) {
        return this.rolesService.remove(data.id);
    }
}
