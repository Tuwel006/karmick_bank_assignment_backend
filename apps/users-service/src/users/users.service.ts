import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
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
    try {
      const user = this.userRepository.create(createUsersDto);
      return await this.userRepository.save(user);
    } catch (error) {
      console.error('Error creating user:', error);
      if (error.code === '23505') { // Postgres unique constraint violation
        if (error.detail.includes('phone')) {
          throw new RpcException({ status: 409, message: 'Phone number already exists' });
        }
        if (error.detail.includes('email')) {
          throw new RpcException({ status: 409, message: 'Email already exists' });
        }
        if (error.detail.includes('username')) {
          throw new RpcException({ status: 409, message: 'Username already exists' });
        }
        throw new RpcException({ status: 409, message: 'User already exists' });
      }
      throw new RpcException({ status: 500, message: 'Internal Server Error' });
    }
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
    console.log('UsersService: Finding user by email:', email);
    return await this.userRepository.findOne({
      where: { email },
      select: ['id', 'username', 'email', 'passwordHash', 'role', 'phone', 'isPhoneVerified', 'isEmailVerified', 'customerId', 'status', 'createdAt', 'updatedAt'],
    });
  }
}
