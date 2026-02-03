import { Controller, Post, Body, Get, Param, Patch, Delete, Query, UseGuards } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MESSAGE_PATTERNS } from '@/utils/constants/MESSAGE_PATTERNS';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RequirePermissions } from '../../../shared/guards/permissions.decorator';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';

@ApiTags('Customer')
@ApiBearerAuth()
@Controller('customer')
@UseGuards(PermissionsGuard)
export class CustomerController {
  constructor(
    @Inject('CUSTOMER_SERVICE') private client: ClientProxy,
  ) { }

  @Post()
  @RequirePermissions('customer', 'canCreate')
  @ApiOperation({ summary: 'Create new customer' })
  create(@Body() data: any) {
    return this.client.send(
      MESSAGE_PATTERNS.customer.CREATE,
      data,
    );
  }

  @Get('stats')
  @RequirePermissions('customer', 'canGet')
  @ApiOperation({ summary: 'Get customer stats' })
  getStats() {
    return this.client.send(MESSAGE_PATTERNS.customer.GET_STATS, {});
  }

  @Get()
  @RequirePermissions('customer', 'canGet')
  @ApiOperation({ summary: 'Get all customers' })
  findAll(@Query() query: any) {
    return this.client.send(MESSAGE_PATTERNS.customer.FIND_ALL, query);
  }

  @Get(':id')
  @RequirePermissions('customer', 'canGet')
  @ApiOperation({ summary: 'Get customer by id' })
  findOne(@Param('id') id: string) {
    return this.client.send(MESSAGE_PATTERNS.customer.FIND_ONE, { id });
  }

  @Patch(':id')
  @RequirePermissions('customer', 'canUpdate')
  @ApiOperation({ summary: 'Update customer' })
  update(
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.client.send(MESSAGE_PATTERNS.customer.UPDATE, {
      id,
      ...data,
    });
  }

  @Delete(':id')
  @RequirePermissions('customer', 'canDelete')
  @ApiOperation({ summary: 'Delete customer' })
  remove(@Param('id') id: string) {
    return this.client.send(MESSAGE_PATTERNS.customer.DELETE, { id });
  }

  @Get(':id/kyc-status')
  @RequirePermissions('customer', 'canGet')
  @ApiOperation({ summary: 'Get customer KYC status' })
  getKycStatus(@Param('id') id: string) {
    return this.client.send(MESSAGE_PATTERNS.customer.GET_KYC_STATUS, { id });
  }
}
