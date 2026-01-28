import { Injectable } from '@nestjs/common';
import { CreateUsersDto } from './dto/create-users.dto';
import { UpdateUsersDto } from './dto/update-users.dto';

@Injectable()
export class UsersService {
  create(createUsersDto: CreateUsersDto) {
    return 'This action adds a new users';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} users`;
  }

  update(id: number, updateUsersDto: UpdateUsersDto) {
    return `This action updates a #${id} users`;
  }

  remove(id: number) {
    return `This action removes a #${id} users`;
  }
}
