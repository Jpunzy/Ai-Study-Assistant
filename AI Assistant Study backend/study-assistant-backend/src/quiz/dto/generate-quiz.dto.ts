import { IsInt, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GenerateQuizDto {
  @ApiProperty({ example: 2, description: 'ID ของเอกสารที่ต้องการสร้างข้อสอบ' })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  documentId: number;

  @ApiPropertyOptional({
    example: 5,
    description: 'จำนวนข้อสอบที่ต้องการ (1-20, ค่าเริ่มต้น 3)',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  @Type(() => Number)
  numQuestions?: number;
}
