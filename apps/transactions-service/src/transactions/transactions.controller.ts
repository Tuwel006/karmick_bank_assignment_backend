import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TransactionsService, DepositDto, WithdrawDto, TransferDto } from './transactions.service';
import { PaginationDto } from '../../../../shared/dto/pagination.dto';
import { RequirePermissions } from '../../../../shared/guards/permissions.decorator';
import { PermissionsGuard } from '../../../../shared/guards/permissions.guard';

@ApiTags('Transactions')
@ApiBearerAuth()
@Controller('transactions')
@UseGuards(PermissionsGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('deposit')
  @RequirePermissions('transaction', 'canCreate')
  @ApiOperation({ summary: 'Process deposit transaction' })
  @ApiResponse({ status: 201, description: 'Deposit processed successfully' })
  async deposit(@Body() depositDto: DepositDto) {
    return this.transactionsService.deposit(depositDto);
  }

  @Post('withdraw')
  @RequirePermissions('transaction', 'canCreate')
  @ApiOperation({ summary: 'Process withdrawal transaction' })
  @ApiResponse({ status: 201, description: 'Withdrawal processed successfully' })
  async withdraw(@Body() withdrawDto: WithdrawDto) {
    return this.transactionsService.withdraw(withdrawDto);
  }

  @Post('transfer')
  @RequirePermissions('transaction', 'canCreate')
  @ApiOperation({ summary: 'Process transfer transaction' })
  @ApiResponse({ status: 201, description: 'Transfer completed successfully' })
  async transfer(@Body() transferDto: TransferDto) {
    return this.transactionsService.transfer(transferDto);
  }

  @Get()
  @RequirePermissions('transaction', 'canGet')
  @ApiOperation({ summary: 'Get all transactions with filters' })
  @ApiResponse({ status: 200, description: 'Transactions retrieved successfully' })
  async findAll(
    @Query('branchId') branchId?: string,
    @Query('accountId') accountId?: string,
    @Query('customerId') customerId?: string,
    @Query() pagination?: PaginationDto
  ) {
    return this.transactionsService.findAll(branchId, accountId, customerId, pagination);
  }

  @Get(':id')
  @RequirePermissions('transaction', 'canGet')
  @ApiOperation({ summary: 'Get transaction by ID' })
  @ApiResponse({ status: 200, description: 'Transaction retrieved successfully' })
  async findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(id);
  }
}