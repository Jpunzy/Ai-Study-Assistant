import { Controller, Get, UseGuards } from '@nestjs/common';
import { LoginlogService } from './loginlog.service';
import {
  CurrentUser,
  type CurrentUserPayload,
} from 'src/auth/decorators/current-user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('loginlog')
export class LoginlogController {
  constructor(private readonly loginlogService: LoginlogService) {}

  @Get('my-logs')
  getMyLoginLogs(@CurrentUser() user: CurrentUserPayload) {
    return this.loginlogService.getMyLoginLogs(user.id);
  }
}
