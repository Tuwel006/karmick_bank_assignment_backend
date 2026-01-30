
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SystemModulesService } from './system-modules.service';

@Controller()
export class SystemModulesController {
    constructor(private readonly service: SystemModulesService) { }

    @MessagePattern('system_modules.create')
    create(@Payload() dto: any) {
        return this.service.create(dto);
    }

    @MessagePattern('system_modules.find_all')
    findAll() {
        return this.service.findAll();
    }
}
