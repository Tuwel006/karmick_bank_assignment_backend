import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BranchService } from './branch.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@Controller()
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @MessagePattern('createBranch')
  create(@Payload() createBranchDto: CreateBranchDto) {
    return this.branchService.create(createBranchDto);
  }

  @MessagePattern('findAllBranch')
  findAll() {
    return this.branchService.findAll();
  }

  @MessagePattern('findOneBranch')
  findOne(@Payload() id: number) {
    return this.branchService.findOne(id);
  }

  @MessagePattern('updateBranch')
  update(@Payload() updateBranchDto: UpdateBranchDto) {
    return this.branchService.update(updateBranchDto.id, updateBranchDto);
  }

  @MessagePattern('removeBranch')
  remove(@Payload() id: number) {
    return this.branchService.remove(id);
  }
}
