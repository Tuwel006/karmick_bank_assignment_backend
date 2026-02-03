import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { RequirePermissions } from '../../../shared/guards/permissions.decorator';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';

@ApiTags('Branch Admin Dashboard')
@ApiBearerAuth()
@Controller('api')
@UseGuards(PermissionsGuard)
export class BranchAdminController {
  private usersClient: ClientProxy;
  private accountsClient: ClientProxy;
  private transactionsClient: ClientProxy;
  private customersClient: ClientProxy;

  constructor() {
    this.usersClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: 'localhost', port: 3001 }
    });
    
    this.accountsClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: 'localhost', port: 3002 }
    });
    
    this.transactionsClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: 'localhost', port: 3003 }
    });
    
    this.customersClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: 'localhost', port: 3004 }
    });
  }

  // Dashboard
  @Get('dashboard/branch')
  @RequirePermissions('branch', 'canGet')
  @ApiOperation({ summary: 'Get branch dashboard data' })
  async getBranchDashboard(@Query('branchId') branchId: string) {
    return this.usersClient.send('get_branch_dashboard', { branchId });
  }

  // Accounts
  @Get('accounts')
  @RequirePermissions('account', 'canGet')
  @ApiOperation({ summary: 'Get accounts with filters' })
  async getAccounts(@Query() query: any) {
    return this.accountsClient.send('get_accounts', query);
  }

  @Post('accounts')
  @RequirePermissions('account', 'canCreate')
  @ApiOperation({ summary: 'Create new account' })
  async createAccount(@Body() createAccountDto: any) {
    return this.accountsClient.send('create_account', createAccountDto);
  }

  @Get('accounts/:id')
  @RequirePermissions('account', 'canGet')
  @ApiOperation({ summary: 'Get account by ID' })
  async getAccount(@Param('id') id: string) {
    return this.accountsClient.send('get_account', { id });
  }

  @Get('accounts/:id/balance')
  @RequirePermissions('account', 'canGet')
  @ApiOperation({ summary: 'Get account balance' })
  async getAccountBalance(@Param('id') id: string) {
    return this.accountsClient.send('get_account_balance', { id });
  }

  @Patch('accounts/:id/status')
  @RequirePermissions('account', 'canUpdate')
  @ApiOperation({ summary: 'Update account status' })
  async updateAccountStatus(@Param('id') id: string, @Body() body: any) {
    return this.accountsClient.send('update_account_status', { id, ...body });
  }

  // Transactions
  @Get('transactions')
  @RequirePermissions('transaction', 'canGet')
  @ApiOperation({ summary: 'Get transactions with filters' })
  async getTransactions(@Query() query: any) {
    return this.transactionsClient.send('get_transactions', query);
  }

  @Post('transactions/deposit')
  @RequirePermissions('transaction', 'canCreate')
  @ApiOperation({ summary: 'Process deposit' })
  async deposit(@Body() depositDto: any) {
    return this.transactionsClient.send('process_deposit', depositDto);
  }

  @Post('transactions/withdraw')
  @RequirePermissions('transaction', 'canCreate')
  @ApiOperation({ summary: 'Process withdrawal' })
  async withdraw(@Body() withdrawDto: any) {
    return this.transactionsClient.send('process_withdraw', withdrawDto);
  }

  @Post('transactions/transfer')
  @RequirePermissions('transaction', 'canCreate')
  @ApiOperation({ summary: 'Process transfer' })
  async transfer(@Body() transferDto: any) {
    return this.transactionsClient.send('process_transfer', transferDto);
  }

  @Get('transactions/:id')
  @RequirePermissions('transaction', 'canGet')
  @ApiOperation({ summary: 'Get transaction by ID' })
  async getTransaction(@Param('id') id: string) {
    return this.transactionsClient.send('get_transaction', { id });
  }

  // Customers
  @Get('customers')
  @RequirePermissions('customer', 'canGet')
  @ApiOperation({ summary: 'Get customers with filters' })
  async getCustomers(@Query() query: any) {
    return this.customersClient.send('get_customers', query);
  }

  @Post('customers')
  @RequirePermissions('customer', 'canCreate')
  @ApiOperation({ summary: 'Create new customer' })
  async createCustomer(@Body() createCustomerDto: any) {
    return this.customersClient.send('create_customer', createCustomerDto);
  }

  @Get('customers/:id')
  @RequirePermissions('customer', 'canGet')
  @ApiOperation({ summary: 'Get customer by ID' })
  async getCustomer(@Param('id') id: string) {
    return this.customersClient.send('get_customer', { id });
  }

  @Patch('customers/:id')
  @RequirePermissions('customer', 'canUpdate')
  @ApiOperation({ summary: 'Update customer' })
  async updateCustomer(@Param('id') id: string, @Body() updateCustomerDto: any) {
    return this.customersClient.send('update_customer', { id, ...updateCustomerDto });
  }

  @Get('customers/:id/kyc-status')
  @RequirePermissions('customer', 'canGet')
  @ApiOperation({ summary: 'Get customer KYC status' })
  async getCustomerKycStatus(@Param('id') id: string) {
    return this.customersClient.send('get_customer_kyc_status', { id });
  }

  // Staff/Users
  @Get('users')
  @RequirePermissions('user', 'canGet')
  @ApiOperation({ summary: 'Get users/staff with filters' })
  async getUsers(@Query() query: any) {
    return this.usersClient.send('get_users', query);
  }

  @Post('users')
  @RequirePermissions('user', 'canCreate')
  @ApiOperation({ summary: 'Create new user/staff' })
  async createUser(@Body() createUserDto: any) {
    return this.usersClient.send('create_user', createUserDto);
  }

  @Get('users/:id')
  @RequirePermissions('user', 'canGet')
  @ApiOperation({ summary: 'Get user by ID' })
  async getUser(@Param('id') id: string) {
    return this.usersClient.send('get_user', { id });
  }

  @Patch('users/:id')
  @RequirePermissions('user', 'canUpdate')
  @ApiOperation({ summary: 'Update user' })
  async updateUser(@Param('id') id: string, @Body() updateUserDto: any) {
    return this.usersClient.send('update_user', { id, ...updateUserDto });
  }
}