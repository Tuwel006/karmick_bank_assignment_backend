import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CustomerService, CreateCustomerDto } from './customer.service';
import { MESSAGE_PATTERNS } from '@/utils/constants/MESSAGE_PATTERNS';

@Controller()
export class CustomerController {
  constructor(private readonly customerService: CustomerService) { }

  @MessagePattern(MESSAGE_PATTERNS.customer.CREATE)
  async create(@Payload() createCustomerDto: CreateCustomerDto) {
    return this.customerService.create(createCustomerDto);
  }

  @MessagePattern(MESSAGE_PATTERNS.customer.FIND_ALL)
  async findAll(@Payload() payload: any) {
    const { branchId, ...pagination } = payload;
    return this.customerService.findAll(branchId, pagination);
  }

  @MessagePattern(MESSAGE_PATTERNS.customer.FIND_ONE)
  async findOne(@Payload() data: { id: string }) {
    return this.customerService.findOne(data.id);
  }

  @MessagePattern(MESSAGE_PATTERNS.customer.UPDATE)
  async update(@Payload() data: any) {
    const { id, ...updateData } = data;
    return this.customerService.update(id, updateData);
  }

  @MessagePattern(MESSAGE_PATTERNS.customer.GET_KYC_STATUS)
  async getKycStatus(@Payload() data: { id: string }) {
    return this.customerService.getKycStatus(data.id);
  }

  @MessagePattern(MESSAGE_PATTERNS.customer.GET_STATS)
  async getStats() {
    return this.customerService.getStats();
  }
}