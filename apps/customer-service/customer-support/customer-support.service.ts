import { Injectable } from '@nestjs/common';
import { CreateCustomerSupportDto } from './dto/create-customer-support.dto';
import { UpdateCustomerSupportDto } from './dto/update-customer-support.dto';

@Injectable()
export class CustomerSupportService {
  create(createCustomerSupportDto: CreateCustomerSupportDto) {
    return 'This action adds a new customerSupport';
  }

  findAll() {
    return `This action returns all customerSupport`;
  }

  findOne(id: number) {
    return `This action returns a #${id} customerSupport`;
  }

  update(id: number, updateCustomerSupportDto: UpdateCustomerSupportDto) {
    return `This action updates a #${id} customerSupport`;
  }

  remove(id: number) {
    return `This action removes a #${id} customerSupport`;
  }
}
