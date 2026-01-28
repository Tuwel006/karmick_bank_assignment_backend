import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MESSAGE_PATTERNS } from '@/utils/constants/MESSAGE_PATTERNS';
import { UsersService } from './users.service';
import { CreateUsersDto } from './dto/create-users.dto';
import { UpdateUsersDto } from './dto/update-users.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern(MESSAGE_PATTERNS.users.CREATE)
  create(@Payload() createUsersDto: CreateUsersDto) {
    return this.usersService.create(createUsersDto);
  }

  @MessagePattern(MESSAGE_PATTERNS.users.FIND_ALL)
  findAll() {
    return this.usersService.findAll();
  }

  @MessagePattern(MESSAGE_PATTERNS.users.FIND_ONE)
  findOne(@Payload() data: any) {
    return this.usersService.findOne(data.id);
  }

  @MessagePattern(MESSAGE_PATTERNS.users.UPDATE)
  update(@Payload() data: any) {
    return this.usersService.update(data.id, data);
  }

  @MessagePattern(MESSAGE_PATTERNS.users.DELETE)
  remove(@Payload() data: any) {
    return this.usersService.remove(data.id);
  }
}
