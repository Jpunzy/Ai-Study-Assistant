import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    const hasRole = requiredRoles.includes(user?.role);

    if (!hasRole) {
      // ❌ ถ้าสิทธิ์ไม่ตรง ดีดกลับด้วย 403 Forbidden
      throw new ForbiddenException(
        'สิทธิ์ของคุณไม่เพียงพอสำหรับเข้าถึงข้อมูลนี้ครับ',
      );
    }

    return true;
  }
}
