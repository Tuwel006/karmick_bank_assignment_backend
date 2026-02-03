
import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BranchService } from './branch.service';
import { CreateBranchDto, UpdateBranchDto } from './dto/branch.dto';
import { PaginationDto } from '@/shared/dto/pagination.dto';
import { MESSAGE_PATTERNS } from '@/utils/constants/MESSAGE_PATTERNS';
import { RequirePermissions } from '@/shared/guards/permissions.decorator';
import { PermissionsGuard } from '@/shared/guards/permissions.guard';

@ApiTags('Branch')
@Controller()
@UseGuards(PermissionsGuard)
export class BranchController {
    constructor(private readonly branchService: BranchService) { }

    @MessagePattern(MESSAGE_PATTERNS.BRANCH.CREATE)
    @RequirePermissions('branch', 'create')
    @ApiOperation({ summary: 'Create a new branch with optional address and admin (Super Admin only)' })
    @ApiResponse({ status: 201, description: 'Branch created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 403, description: 'Insufficient permissions' })
    create(@Payload() createBranchDto: CreateBranchDto) {
        return this.branchService.create(createBranchDto);
    }

    @MessagePattern(MESSAGE_PATTERNS.BRANCH.FIND_ALL)
    @RequirePermissions('branch', 'read')
    @ApiOperation({ summary: 'Get all branches with pagination and filtering' })
    @ApiResponse({ status: 200, description: 'Branches retrieved successfully' })
    findAll(@Payload() paginationDto: PaginationDto) {
        return this.branchService.findAll(paginationDto);
    }

    @MessagePattern(MESSAGE_PATTERNS.BRANCH.FIND_ONE)
    @RequirePermissions('branch', 'read')
    @ApiOperation({ summary: 'Get branch by ID' })
    @ApiResponse({ status: 200, description: 'Branch retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Branch not found' })
    findOne(@Payload() data: { id: string }) {
        return this.branchService.findOne(data.id);
    }

    @MessagePattern(MESSAGE_PATTERNS.BRANCH.UPDATE)
    @RequirePermissions('branch', 'update')
    @ApiOperation({ summary: 'Update branch by ID (Super Admin only)' })
    @ApiResponse({ status: 200, description: 'Branch updated successfully' })
    @ApiResponse({ status: 404, description: 'Branch not found' })
    @ApiResponse({ status: 403, description: 'Insufficient permissions' })
    update(@Payload() data: { id: string } & UpdateBranchDto) {
        const { id, ...updateData } = data;
        return this.branchService.update(id, updateData);
    }

    @MessagePattern(MESSAGE_PATTERNS.BRANCH.DELETE)
    @RequirePermissions('branch', 'delete')
    @ApiOperation({ summary: 'Delete branch by ID (Super Admin only)' })
    @ApiResponse({ status: 200, description: 'Branch deleted successfully' })
    @ApiResponse({ status: 404, description: 'Branch not found' })
    @ApiResponse({ status: 403, description: 'Insufficient permissions' })
    remove(@Payload() data: { id: string }) {
        return this.branchService.remove(data.id);
    }
}
