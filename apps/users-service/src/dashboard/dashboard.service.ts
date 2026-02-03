import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from '../branch/entities/branch.entity';
import { User } from '../users/entities/users.entity';
import { ResponseHelper } from '../../../../shared/helpers/response.helper';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Branch)
    private branchRepository: Repository<Branch>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getBranchDashboard(branchId: string) {
    try {
      const branch = await this.branchRepository.findOne({
        where: { id: branchId },
        relations: ['address']
      });

      if (!branch) {
        throw new BadRequestException('Branch not found');
      }

      // Get branch staff count
      const staffCount = await this.userRepository.count({
        where: { branch: { id: branchId } }
      });

      const dashboardData = {
        branch: {
          id: branch.id,
          name: branch.name,
          ifsc: branch.ifsc,
          address: branch.address
        },
        stats: {
          totalStaff: staffCount,
          // These will be populated by calling other microservices
          totalAccounts: 0,
          totalCustomers: 0,
          totalBalance: '0.00',
          todayTransactions: 0
        },
        recentActivity: []
      };

      return ResponseHelper.success(dashboardData, 'Dashboard data retrieved successfully');
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException(ResponseHelper.error('Failed to fetch dashboard data', error.message));
    }
  }
}