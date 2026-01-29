import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUsersDto } from './dto/create-users.dto';
import { UpdateUsersDto } from './dto/update-users.dto';
import { User } from './entities/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async create(createUsersDto: CreateUsersDto) {
    const user = this.userRepository.create(createUsersDto);
    return await this.userRepository.save(user);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: string) {
    return await this.userRepository.findOneBy({ id } as any);
  }

  async update(id: string, updateUsersDto: UpdateUsersDto) {
    await this.userRepository.update(id, updateUsersDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    return await this.userRepository.delete(id);
  }

  async findByEmailWithPassword(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      select: ['id', 'username', 'email', 'passwordHash', 'role', 'phone', 'isPhoneVerified', 'isEmailVerified', 'customerId', 'status', 'createdAt', 'updatedAt'],
    });
  }
}
