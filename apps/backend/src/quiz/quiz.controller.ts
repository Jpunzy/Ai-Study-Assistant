import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { QuizService } from './quiz.service';
import { GenerateQuizDto } from './dto/generate-quiz.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CurrentUser,
  type CurrentUserPayload,
} from '../auth/decorators/current-user.decorator';

@ApiTags('Quizzes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('quizzes')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post('generate')
  generateQuiz(
    @Body() dto: GenerateQuizDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.quizService.generateAndSaveQuiz(
      dto.documentId,
      user.id,
      dto.numQuestions ?? 3,
    );
  }

  @Get('my-quizzes')
  getMyQuizzes(@CurrentUser() user: CurrentUserPayload) {
    return this.quizService.getMyQuizzes(user.id);
  }
}
