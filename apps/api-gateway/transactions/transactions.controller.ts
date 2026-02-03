import { Controller, Post, Body, Get, Param, Query, UseGuards } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MESSAGE_PATTERNS } from '@/utils/constants/MESSAGE_PATTERNS';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RequirePermissions } from '../../../shared/guards/permissions.decorator';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';

@ApiTags('Transactions')
@ApiBearerAuth()
@Controller('transactions')
@UseGuards(PermissionsGuard)
export class TransactionsController {
  constructor(
    @Inject('TRANSACTIONS_SERVICE') private client: ClientProxy,
  ) { }

  @Post('deposit')
  @RequirePermissions('transaction', 'canCreate')
  @ApiOperation({ summary: 'Deposit funds' })
  deposit(@Body() data: any) {
    return this.client.send(MESSAGE_PATTERNS.transactions.DEPOSIT, data);
  }

  @Post('withdraw')
  @RequirePermissions('transaction', 'canCreate')
  @ApiOperation({ summary: 'Withdraw funds' })
  withdraw(@Body() data: any) {
    return this.client.send(MESSAGE_PATTERNS.transactions.WITHDRAW, data);
  }

  @Post('transfer')
  @RequirePermissions('transaction', 'canCreate')
  @ApiOperation({ summary: 'Transfer funds' })
  transfer(@Body() data: any) {
    return this.client.send(MESSAGE_PATTERNS.transactions.TRANSFER, data);
  }

  @Get('stats')
  @RequirePermissions('transaction', 'canGet')
  @ApiOperation({ summary: 'Get transaction stats' })
  getStats() {
    return this.client.send(MESSAGE_PATTERNS.transactions.GET_STATS, {});
  }

  @Get()
  @RequirePermissions('transaction', 'canGet')
  @ApiOperation({ summary: 'Get all transactions' })
  findAll(@Query() query: any) {
    return this.client.send(MESSAGE_PATTERNS.transactions.FIND_ALL, query);
  }

  @Get(':id')
  @RequirePermissions('transaction', 'canGet')
  @ApiOperation({ summary: 'Get transaction by ID' })
  findOne(@Param('id') id: string) {
    return this.client.send(MESSAGE_PATTERNS.transactions.FIND_ONE, { id });
  }
}
