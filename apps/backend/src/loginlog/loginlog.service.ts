import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LoginlogService {
  constructor(private prisma: PrismaService) {}
  getMyLoginLogs(userId: number) {
    return this.prisma.loginLog.findMany({
      where: { userId },
      orderBy: { loginTime: 'asc' },
    });
  }
}
