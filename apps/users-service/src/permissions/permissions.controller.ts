
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PermissionsService } from './permissions.service';

@Controller()
export class PermissionsController {
    constructor(private readonly service: PermissionsService) { }

    @MessagePattern('permissions.create')
    create(@Payload() dto: any) {
        return this.service.create(dto);
    }

    @MessagePattern('permissions.find_all')
    findAll() {
        return this.service.findAll();
    }
}
