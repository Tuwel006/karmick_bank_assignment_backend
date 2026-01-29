import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CustomerSupportService } from './customer-support.service';
import { CreateCustomerSupportDto } from './dto/create-customer-support.dto';
import { UpdateCustomerSupportDto } from './dto/update-customer-support.dto';

@Controller()
export class CustomerSupportController {
  constructor(private readonly customerSupportService: CustomerSupportService) {}

  @MessagePattern('createCustomerSupport')
  create(@Payload() createCustomerSupportDto: CreateCustomerSupportDto) {
    return this.customerSupportService.create(createCustomerSupportDto);
  }

  @MessagePattern('findAllCustomerSupport')
  findAll() {
    return this.customerSupportService.findAll();
  }

  @MessagePattern('findOneCustomerSupport')
  findOne(@Payload() id: number) {
    return this.customerSupportService.findOne(id);
  }

  @MessagePattern('updateCustomerSupport')
  update(@Payload() updateCustomerSupportDto: UpdateCustomerSupportDto) {
    return this.customerSupportService.update(updateCustomerSupportDto.id, updateCustomerSupportDto);
  }

  @MessagePattern('removeCustomerSupport')
  remove(@Payload() id: number) {
    return this.customerSupportService.remove(id);
  }
}
