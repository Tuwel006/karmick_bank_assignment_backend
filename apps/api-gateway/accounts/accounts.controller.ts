import { Controller, Post, Body, Get, Param, Patch, Delete, Query, UseGuards } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MESSAGE_PATTERNS } from '@/utils/constants/MESSAGE_PATTERNS';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RequirePermissions } from '../../../shared/guards/permissions.decorator';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';

@ApiTags('Accounts')
@ApiBearerAuth()
@Controller('accounts')
@UseGuards(PermissionsGuard)
export class AccountsController {
  constructor(
    @Inject('ACCOUNTS_SERVICE') private client: ClientProxy,
  ) { }

  @Post('create-with-customer')
  @RequirePermissions('account', 'canCreate')
  @ApiOperation({ summary: 'Create account with customer' })
  createAccountWithCustomer(@Body() data: any) {
    return this.client.send(MESSAGE_PATTERNS.accounts.CREATE_WITH_CUSTOMER, data);
  }

  @Get('with-customers')
  @RequirePermissions('account', 'canGet')
  @ApiOperation({ summary: 'Get accounts with customer details' })
  findAccountsWithCustomers(@Query() query: any) {
    return this.client.send(MESSAGE_PATTERNS.accounts.FIND_WITH_CUSTOMERS, query);
  }

  @Post()
  @RequirePermissions('account', 'canCreate')
  @ApiOperation({ summary: 'Create account' })
  create(@Body() data: any) {
    return this.client.send(
      MESSAGE_PATTERNS.accounts.CREATE,
      data,
    );
  }

  @Get()
  @RequirePermissions('account', 'canGet')
  @ApiOperation({ summary: 'Get all accounts' })
  findAll(@Query() query: any) {
    // If frontend calls /accounts without 'with-customers' path but expects similar data,
    // we route to FIND_WITH_CUSTOMERS or standard FIND_ALL.
    // Given the microservice implementation calling findAccountsWithCustomers for findAll too,
    // we can use FIND_ALL which maps to that in Microservice.
    return this.client.send(MESSAGE_PATTERNS.accounts.FIND_ALL, query);
  }

  @Get(':id')
  @RequirePermissions('account', 'canGet')
  @ApiOperation({ summary: 'Get account by ID' })
  findOne(@Param('id') id: string) {
    return this.client.send(MESSAGE_PATTERNS.accounts.FIND_ONE, { id });
  }

  @Get(':id/balance')
  @RequirePermissions('account', 'canGet')
  @ApiOperation({ summary: 'Get account balance' })
  getBalance(@Param('id') id: string) {
    return this.client.send(MESSAGE_PATTERNS.accounts.GET_BALANCE, { id });
  }

  @Patch(':id/status')
  @RequirePermissions('account', 'canUpdate')
  @ApiOperation({ summary: 'Update account status' })
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: any,
  ) {
    return this.client.send(MESSAGE_PATTERNS.accounts.UPDATE_STATUS, {
      id,
      status,
    });
  }

  @Patch(':id')
  @RequirePermissions('account', 'canUpdate')
  @ApiOperation({ summary: 'Update account' })
  update(
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.client.send(MESSAGE_PATTERNS.accounts.UPDATE, {
      id,
      ...data,
    });
  }

  @Delete(':id')
  @RequirePermissions('account', 'canDelete')
  @ApiOperation({ summary: 'Delete account' })
  remove(@Param('id') id: string) {
    return this.client.send(MESSAGE_PATTERNS.accounts.DELETE, { id });
  }
}
