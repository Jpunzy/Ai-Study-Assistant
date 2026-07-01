import { Module } from '@nestjs/common';
import { LoginlogService } from './loginlog.service';
import { LoginlogController } from './loginlog.controller';

@Module({
  controllers: [LoginlogController],
  providers: [LoginlogService],
})
export class LoginlogModule {}
