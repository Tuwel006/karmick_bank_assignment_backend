import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { RequirePermissions } from '../../../../shared/guards/permissions.decorator';
import { PermissionsGuard } from '../../../../shared/guards/permissions.guard';

@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller('dashboard')
@UseGuards(PermissionsGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('branch')
  @RequirePermissions('branch', 'canGet')
  @ApiOperation({ summary: 'Get branch dashboard overview' })
  @ApiResponse({ status: 200, description: 'Dashboard data retrieved successfully' })
  async getBranchDashboard(@Query('branchId') branchId: string) {
    return this.dashboardService.getBranchDashboard(branchId);
  }
}