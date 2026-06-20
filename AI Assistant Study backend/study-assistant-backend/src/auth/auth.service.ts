import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto/register.dto';
import { LoginDto } from './dto/login.dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async register(body: RegisterDto) {
    const { name, email, password } = body;

    const userExists = await this.usersService.findUserByEmail(email);
    if (userExists) {
      throw new BadRequestException('อีเมลนี้ถูกใช้งานไปแล้วครับ');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.prisma.user.create({
      data: { name, email, password: hashedPassword, role: 'User' },
      omit: { password: true },
    });
  }

  async signIn(
    body: LoginDto,
    ipAddress: string,
    userAgent: string,
  ): Promise<{ access_token: string }> {
    const { email, password } = body;

    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('ไม่พบผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    await this.prisma.loginLog.create({
      data: {
        userId: user.id,
        ipAddress,
        userAgent,
        status: isPasswordValid ? 'SUCCESS' : 'FAILED',
        failureReason: isPasswordValid ? null : 'Invalid password',
      },
    });

    if (!isPasswordValid) {
      throw new UnauthorizedException('ไม่พบผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    return { access_token: await this.jwtService.signAsync(payload) };
  }
}
