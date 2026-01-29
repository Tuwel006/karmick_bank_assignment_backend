import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MESSAGE_PATTERNS } from '@/utils/constants/MESSAGE_PATTERNS';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @MessagePattern(MESSAGE_PATTERNS.auth.CREATE)
  create(@Payload() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @MessagePattern(MESSAGE_PATTERNS.auth.LOGIN)
  login(@Payload() loginDto: any) {
    return this.authService.login(loginDto);
  }

  @MessagePattern(MESSAGE_PATTERNS.auth.FIND_ALL)
  findAll() {
    return this.authService.findAll();
  }

  @MessagePattern(MESSAGE_PATTERNS.auth.FIND_ONE)
  findOne(@Payload() data: any) {
    return this.authService.findOne(data.id);
  }

  @MessagePattern(MESSAGE_PATTERNS.auth.UPDATE)
  update(@Payload() data: any) {
    return this.authService.update(data.id, data);
  }

  @MessagePattern(MESSAGE_PATTERNS.auth.DELETE)
  remove(@Payload() data: any) {
    return this.authService.remove(data.id);
  }
}
