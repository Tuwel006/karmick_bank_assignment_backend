import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerSupportDto } from './create-customer-support.dto';

export class UpdateCustomerSupportDto extends PartialType(CreateCustomerSupportDto) {
  id: number;
}
