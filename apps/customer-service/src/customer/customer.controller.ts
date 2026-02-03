import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CustomerService, CreateCustomerDto } from './customer.service';
import { RequirePermissions } from '../../../../shared/guards/permissions.decorator';
import { PermissionsGuard } from '../../../../shared/guards/permissions.guard';

@ApiTags('Customers')
@ApiBearerAuth()
@Controller('customers')
@UseGuards(PermissionsGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @RequirePermissions('customer', 'canCreate')
  @ApiOperation({ summary: 'Create new customer' })
  @ApiResponse({ status: 201, description: 'Customer created successfully' })
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.create(createCustomerDto);
  }

  @Get()
  @RequirePermissions('customer', 'canGet')
  @ApiOperation({ summary: 'Get all customers with filters' })
  @ApiResponse({ status: 200, description: 'Customers retrieved successfully' })
  async findAll(
    @Query('branchId') branchId?: string,
    @Query() pagination?: any
  ) {
    return this.customerService.findAll(branchId, pagination);
  }

  @Get(':id')
  @RequirePermissions('customer', 'canGet')
  @ApiOperation({ summary: 'Get customer by ID' })
  @ApiResponse({ status: 200, description: 'Customer retrieved successfully' })
  async findOne(@Param('id') id: string) {
    return this.customerService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions('customer', 'canUpdate')
  @ApiOperation({ summary: 'Update customer' })
  @ApiResponse({ status: 200, description: 'Customer updated successfully' })
  async update(@Param('id') id: string, @Body() updateCustomerDto: Partial<CreateCustomerDto>) {
    return this.customerService.update(id, updateCustomerDto);
  }

  @Get(':id/kyc-status')
  @RequirePermissions('customer', 'canGet')
  @ApiOperation({ summary: 'Get customer KYC status' })
  @ApiResponse({ status: 200, description: 'KYC status retrieved successfully' })
  async getKycStatus(@Param('id') id: string) {
    return this.customerService.getKycStatus(id);
  }
}