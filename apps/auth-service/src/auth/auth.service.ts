import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { MESSAGE_PATTERNS } from '@/utils/constants/MESSAGE_PATTERNS';
import * as bcrypt from 'bcrypt';
import { firstValueFrom } from 'rxjs';
import { CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersClient: ClientProxy,
    private readonly jwtService: JwtService,
  ) { }

  async register(createAuthDto: CreateAuthDto) {
    const { password, ...userData } = createAuthDto as any;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { ...userData, passwordHash: hashedPassword };

    return await firstValueFrom(this.usersClient.send(MESSAGE_PATTERNS.users.CREATE, newUser));
  }

  async login(loginDto: any) {
    const user = await firstValueFrom(
      this.usersClient.send(MESSAGE_PATTERNS.users.FIND_BY_EMAIL_WITH_PASSWORD, { email: loginDto.email })
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, username: user.username, email: user.email, role: user.role, status: user.status };
    const access_token = this.jwtService.sign(payload);

    // Remove sensitive data from response
    const { passwordHash, ...result } = user;
    return {
      access_token,
      user: result
    };
  }

  findAll() {
    return 'This action returns all auth';
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: any) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
