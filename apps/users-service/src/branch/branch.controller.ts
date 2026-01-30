
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BranchService } from './branch.service';

@Controller()
export class BranchController {
    constructor(private readonly branchService: BranchService) { }

    @MessagePattern('branch.create')
    create(@Payload() createBranchDto: any) {
        return this.branchService.create(createBranchDto);
    }

    @MessagePattern('branch.find_all')
    findAll() {
        return this.branchService.findAll();
    }

    @MessagePattern('branch.find_one')
    findOne(@Payload() data: { id: string }) {
        return this.branchService.findOne(data.id);
    }

    @MessagePattern('branch.update')
    update(@Payload() data: any) {
        return this.branchService.update(data.id, data);
    }

    @MessagePattern('branch.delete')
    remove(@Payload() data: { id: string }) {
        return this.branchService.remove(data.id);
    }
}
