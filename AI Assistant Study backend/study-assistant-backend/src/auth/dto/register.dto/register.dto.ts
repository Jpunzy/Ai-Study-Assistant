import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Japan' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'japan@example.com' })
  @IsEmail({}, { message: 'รูปแบบอีเมลไม่ถูกต้อง' })
  email: string;

  @ApiProperty({ example: 'Password123', minLength: 6 })
  @IsNotEmpty()
  @Length(6, 50, { message: 'รหัสผ่านต้องมีความยาว 6-50 ตัวอักษร' })
  password: string;
}
