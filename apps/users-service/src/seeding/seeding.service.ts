import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Role } from '../roles/entities/role.entity';
import { SystemModule } from '../system-modules/entities/system-module.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { Branch } from '../branch/entities/branch.entity';
import { Address } from '../address/entities/address.entity';
import { User } from '../users/entities/users.entity';
import { UserStatus } from '../users/enums/user-status.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedingService implements OnModuleInit {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(SystemModule)
    private moduleRepository: Repository<SystemModule>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(Branch)
    private branchRepository: Repository<Branch>,
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dataSource: DataSource,
  ) { }

  async onModuleInit() {
    await this.seedData();
  }

  private async seedData() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create system modules
      const branchModule = await this.createModuleIfNotExists('branch');
      const userModule = await this.createModuleIfNotExists('user');
      const accountModule = await this.createModuleIfNotExists('account');
      const transactionModule = await this.createModuleIfNotExists('transaction');
      const customerModule = await this.createModuleIfNotExists('customer');
      const notificationModule = await this.createModuleIfNotExists('notification');

      // Create roles
      const superAdminRole = await this.createRoleIfNotExists('super_admin', 'Super Administrator');
      const branchAdminRole = await this.createRoleIfNotExists('branch_admin', 'Branch Administrator');
      const customerRole = await this.createRoleIfNotExists('customer', 'Customer');

      // Super admin permissions (all modules, all permissions)
      await this.createPermissionIfNotExists(superAdminRole.id, branchModule.id, true, true, true, true);
      await this.createPermissionIfNotExists(superAdminRole.id, userModule.id, true, true, true, true);
      await this.createPermissionIfNotExists(superAdminRole.id, accountModule.id, true, true, true, true);
      await this.createPermissionIfNotExists(superAdminRole.id, transactionModule.id, true, true, true, true);
      await this.createPermissionIfNotExists(superAdminRole.id, customerModule.id, true, true, true, true);
      await this.createPermissionIfNotExists(superAdminRole.id, notificationModule.id, true, true, true, true);

      // Branch admin permissions (limited)
      await this.createPermissionIfNotExists(branchAdminRole.id, userModule.id, true, true, true, false);
      await this.createPermissionIfNotExists(branchAdminRole.id, accountModule.id, true, true, true, false);
      await this.createPermissionIfNotExists(branchAdminRole.id, transactionModule.id, true, true, false, false);
      await this.createPermissionIfNotExists(branchAdminRole.id, customerModule.id, true, true, true, false);
      await this.createPermissionIfNotExists(branchAdminRole.id, branchModule.id, false, true, false, false);

      // Customer permissions (very limited)
      await this.createPermissionIfNotExists(customerRole.id, accountModule.id, false, true, false, false);
      await this.createPermissionIfNotExists(customerRole.id, transactionModule.id, true, true, false, false);

      // Create default branches
      await this.createDefaultBranches();

      // Create default users
      await this.createDefaultUsers();

      await queryRunner.commitTransaction();
      console.log('✅ Seeding completed successfully');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('❌ Seeding failed:', error.message);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async createDefaultUsers() {
    const roles = {
      super_admin: await this.roleRepository.findOne({ where: { name: 'super_admin' } }),
      branch_admin: await this.roleRepository.findOne({ where: { name: 'branch_admin' } }),
      customer: await this.roleRepository.findOne({ where: { name: 'customer' } }),
    };

    const headOffice = await this.branchRepository.findOne({ where: { name: 'Karmick Bank Head Office' } });

    const usersToCreate = [
      {
        firstName: 'System',
        lastName: 'Administrator',
        email: 'super.admin@karmickbank.com',
        phone: '9999999999',
        password: 'Admin@123',
        roleEntity: roles.super_admin,
        branch: undefined,
      },
      {
        firstName: 'Branch',
        lastName: 'Manager',
        email: 'branch.admin@karmickbank.com',
        phone: '8888888888',
        password: 'Admin@123',
        roleEntity: roles.branch_admin,
        branch: headOffice || undefined,
      },
      {
        firstName: 'Default',
        lastName: 'Customer',
        email: 'customer@karmickbank.com',
        phone: '7777777777',
        password: 'Admin@123',
        roleEntity: roles.customer,
        branch: headOffice || undefined,
      }
    ];

    const hashedPassword = await bcrypt.hash('Admin@123', 10);

    for (const userData of usersToCreate) {
      const existing = await this.userRepository.findOne({
        where: [
          { email: userData.email },
          { phone: userData.phone }
        ]
      });
      if (!existing && userData.roleEntity) {
        // cast branch explicitly to avoid type error with DeepPartial
        const branchVal = userData.branch as unknown as Branch;

        const user = this.userRepository.create({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phone: userData.phone,
          passwordHash: hashedPassword,
          roleEntity: userData.roleEntity,
          branch: branchVal,
          status: UserStatus.ACTIVE
        });
        await this.userRepository.save(user);
        console.log(`👤 Created default user: ${userData.email} (${userData.roleEntity.name})`);
      }
    }
  }

  private async createModuleIfNotExists(name: string) {
    let module = await this.moduleRepository.findOne({ where: { name } });
    if (!module) {
      module = this.moduleRepository.create({ name });
      module = await this.moduleRepository.save(module);
      console.log(`📦 Created module: ${name}`);
    }
    return module;
  }

  private async createRoleIfNotExists(name: string, description: string) {
    let role = await this.roleRepository.findOne({ where: { name } });
    if (!role) {
      role = this.roleRepository.create({ name, description });
      role = await this.roleRepository.save(role);
      console.log(`👤 Created role: ${name}`);
    }
    return role;
  }

  private async createPermissionIfNotExists(
    roleId: string,
    moduleId: string,
    canCreate: boolean,
    canGet: boolean,
    canUpdate: boolean,
    canDelete: boolean
  ) {
    const existing = await this.permissionRepository.findOne({
      where: { roleId, moduleId }
    });

    if (!existing) {
      const permission = this.permissionRepository.create({
        roleId,
        moduleId,
        canCreate,
        canGet,
        canUpdate,
        canDelete
      });
      await this.permissionRepository.save(permission);
      console.log(`🔐 Created permission for role ${roleId} on module ${moduleId}`);
    }
  }

  private async createDefaultBranches() {
    const branches = [
      {
        name: 'Karmick Bank Head Office',
        address: {
          addressLine1: 'Karmick Tower, Business District',
          addressLine2: 'Financial Center',
          landmark: 'Near Stock Exchange',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          country: 'India',
          type: 'office'
        }
      },
      {
        name: 'Karmick Bank Delhi Branch',
        address: {
          addressLine1: 'Connaught Place',
          addressLine2: 'Central Delhi',
          landmark: 'Near Metro Station',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110001',
          country: 'India',
          type: 'office'
        }
      }
    ];

    for (const branchData of branches) {
      const existingBranch = await this.branchRepository.findOne({
        where: { name: branchData.name }
      });

      if (!existingBranch) {
        // Create address
        const address = this.addressRepository.create(branchData.address);
        const savedAddress = await this.addressRepository.save(address);

        // Create branch
        const branch = this.branchRepository.create({
          name: branchData.name,
          ifsc: this.generateIFSC(),
          address: savedAddress
        });
        await this.branchRepository.save(branch);
        console.log(`🏢 Created default branch: ${branchData.name}`);
      }
    }
  }

  async createBranchAdmin(branchId: string, adminData: any) {
    const branchAdminRole = await this.roleRepository.findOne({ where: { name: 'branch_admin' } });
    if (!branchAdminRole) {
      throw new Error('Branch Admin role not found');
    }

    const hashedPassword = await bcrypt.hash(adminData.password || 'Admin@123', 10);
    const user = this.userRepository.create({
      firstName: adminData.firstName,
      lastName: adminData.lastName,
      email: adminData.email,
      phone: adminData.phone,
      passwordHash: hashedPassword,
      roleEntity: branchAdminRole,
      branch: { id: branchId } as any,
      status: UserStatus.ACTIVE
    });

    await this.userRepository.save(user);
    console.log(`👤 Created branch admin: ${adminData.email} for branch ${branchId}`);
  }

  private generateIFSC(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `KB${timestamp.slice(-6)}${random}`;
  }


}