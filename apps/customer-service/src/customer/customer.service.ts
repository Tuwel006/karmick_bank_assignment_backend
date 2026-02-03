import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Customer, CustomerStatus, KYCStatus } from './entities/customer.entity';
import { ResponseHelper } from '../../../../shared/helpers/response.helper';

export interface CreateCustomerDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  branchId: string;
  dateOfBirth: string;
  gender: string;
  address?: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country?: string;
  };
}

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    private dataSource: DataSource,
  ) {}

  async create(createCustomerDto: CreateCustomerDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Check if email already exists
      const existingCustomer = await this.customerRepository.findOne({ where: { email: createCustomerDto.email } });
      if (existingCustomer) {
        throw new BadRequestException('Email already exists');
      }

      // Generate customer number
      const customerNumber = await this.generateCustomerNumber();

      // Create customer
      const customer = this.customerRepository.create({
        customerNumber,
        firstName: createCustomerDto.firstName,
        lastName: createCustomerDto.lastName,
        email: createCustomerDto.email,
        phone: createCustomerDto.phone,
        dateOfBirth: new Date(createCustomerDto.dateOfBirth),
        gender: createCustomerDto.gender as any,
        branchId: createCustomerDto.branchId,
        status: CustomerStatus.ACTIVE,
        kycStatus: KYCStatus.NOT_STARTED
      });

      const savedCustomer = await queryRunner.manager.save(customer);
      await queryRunner.commitTransaction();

      return ResponseHelper.success(savedCustomer, 'Customer created successfully');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException(ResponseHelper.error('Failed to create customer', error.message));
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(branchId?: string, pagination?: any) {
    try {
      const query = this.customerRepository.createQueryBuilder('customer')
        .orderBy('customer.createdAt', 'DESC');

      if (branchId) {
        query.andWhere('customer.branchId = :branchId', { branchId });
      }

      if (pagination) {
        const { page = 1, limit = 10 } = pagination;
        query.skip((page - 1) * limit).take(limit);
      }

      const [customers, total] = await query.getManyAndCount();

      return ResponseHelper.paginated(customers, total, pagination?.page || 1, pagination?.limit || 10);
    } catch (error) {
      throw new BadRequestException(ResponseHelper.error('Failed to fetch customers', error.message));
    }
  }

  async findOne(id: string) {
    try {
      const customer = await this.customerRepository.findOne({ where: { id } });

      if (!customer) {
        throw new NotFoundException(ResponseHelper.error('Customer not found'));
      }

      return ResponseHelper.success(customer, 'Customer retrieved successfully');
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException(ResponseHelper.error('Failed to fetch customer', error.message));
    }
  }

  async update(id: string, updateCustomerDto: Partial<CreateCustomerDto>) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const customer = await this.customerRepository.findOne({ where: { id } });

      if (!customer) {
        throw new NotFoundException('Customer not found');
      }

      // Update customer fields
      if (updateCustomerDto.firstName) customer.firstName = updateCustomerDto.firstName;
      if (updateCustomerDto.lastName) customer.lastName = updateCustomerDto.lastName;
      if (updateCustomerDto.phone) customer.phone = updateCustomerDto.phone;

      const updatedCustomer = await queryRunner.manager.save(customer);
      await queryRunner.commitTransaction();

      return ResponseHelper.success(updatedCustomer, 'Customer updated successfully');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException(ResponseHelper.error('Failed to update customer', error.message));
    } finally {
      await queryRunner.release();
    }
  }

  async getKycStatus(id: string) {
    try {
      const customer = await this.customerRepository.findOne({ where: { id } });

      if (!customer) {
        throw new NotFoundException(ResponseHelper.error('Customer not found'));
      }

      const kycStatus = {
        customerId: id,
        status: customer.kycStatus,
        verifiedAt: customer.kycVerifiedAt,
        remarks: customer.kycRemarks
      };

      return ResponseHelper.success(kycStatus, 'KYC status retrieved successfully');
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException(ResponseHelper.error('Failed to fetch KYC status', error.message));
    }
  }

  private async generateCustomerNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `CU${year}${timestamp.slice(-6)}${random}`;
  }
}