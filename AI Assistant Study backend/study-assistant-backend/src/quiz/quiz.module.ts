import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from 'src/prisma/prisma.service';
@Module({
  imports: [HttpModule],
  providers: [QuizService, PrismaService],
  controllers: [QuizController],
})
export class QuizModule {}
