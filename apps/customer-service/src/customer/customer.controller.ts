import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MESSAGE_PATTERNS } from '@/utils/constants/MESSAGE_PATTERNS';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller()
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @MessagePattern(MESSAGE_PATTERNS.customer.CREATE)
  create(@Payload() createCustomerDto: CreateCustomerDto) {
    return this.customerService.create(createCustomerDto);
  }

  @MessagePattern(MESSAGE_PATTERNS.customer.FIND_ALL)
  findAll() {
    return this.customerService.findAll();
  }

  @MessagePattern(MESSAGE_PATTERNS.customer.FIND_ONE)
  findOne(@Payload() data: any) {
    return this.customerService.findOne(data.id);
  }

  @MessagePattern(MESSAGE_PATTERNS.customer.UPDATE)
  update(@Payload() data: any) {
    return this.customerService.update(data.id, data);
  }

  @MessagePattern(MESSAGE_PATTERNS.customer.DELETE)
  remove(@Payload() data: any) {
    return this.customerService.remove(data.id);
  }
}
