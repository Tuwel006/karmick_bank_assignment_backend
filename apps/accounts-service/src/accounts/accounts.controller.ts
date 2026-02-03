import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-accounts.dto';
import { PaginationDto } from '../../../../shared/dto/pagination.dto';
import { RequirePermissions } from '../../../../shared/guards/permissions.decorator';
import { PermissionsGuard } from '../../../../shared/guards/permissions.guard';
import { AccountStatus } from './entities/bank-account.entity';

@ApiTags('Accounts')
@ApiBearerAuth()
@Controller('accounts')
@UseGuards(PermissionsGuard)
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post('create-with-customer')
  @RequirePermissions('account', 'canCreate')
  @ApiOperation({ summary: 'Create account with customer details' })
  @ApiResponse({ status: 201, description: 'Account and customer created successfully' })
  async createAccountWithCustomer(@Body() createDto: any) {
    return this.accountsService.createAccountWithCustomer(createDto);
  }

  @Get('with-customers')
  @RequirePermissions('account', 'canGet')
  @ApiOperation({ summary: 'Get accounts with customer details' })
  @ApiResponse({ status: 200, description: 'Accounts with customers retrieved successfully' })
  async findAccountsWithCustomers(
    @Query('branchId') branchId?: string,
    @Query() pagination?: PaginationDto
  ) {
    return this.accountsService.findAccountsWithCustomers(branchId, pagination);
  }

  @Post()
  @RequirePermissions('account', 'canCreate')
  @ApiOperation({ summary: 'Create new bank account' })
  @ApiResponse({ status: 201, description: 'Account created successfully' })
  async create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountsService.create(createAccountDto);
  }

  @Get()
  @RequirePermissions('account', 'canGet')
  @ApiOperation({ summary: 'Get accounts with customer details' })
  @ApiResponse({ status: 200, description: 'Accounts retrieved successfully' })
  async findAll(
    @Query('branchId') branchId?: string,
    @Query('customerId') customerId?: string,
    @Query() pagination?: PaginationDto
  ) {
    return this.accountsService.findAccountsWithCustomers(branchId, pagination);
  }

  @Get(':id')
  @RequirePermissions('account', 'canGet')
  @ApiOperation({ summary: 'Get account by ID' })
  @ApiResponse({ status: 200, description: 'Account retrieved successfully' })
  async findOne(@Param('id') id: string) {
    return this.accountsService.findOne(id);
  }

  @Get(':id/balance')
  @RequirePermissions('account', 'canGet')
  @ApiOperation({ summary: 'Get account balance' })
  @ApiResponse({ status: 200, description: 'Balance retrieved successfully' })
  async getBalance(@Param('id') id: string) {
    return this.accountsService.getBalance(id);
  }

  @Patch(':id/status')
  @RequirePermissions('account', 'canUpdate')
  @ApiOperation({ summary: 'Update account status' })
  @ApiResponse({ status: 200, description: 'Account status updated successfully' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: AccountStatus
  ) {
    return this.accountsService.updateStatus(id, status);
  }
}