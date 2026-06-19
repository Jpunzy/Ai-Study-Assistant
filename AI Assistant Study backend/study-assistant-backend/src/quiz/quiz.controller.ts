import { Controller, Post, Body, ParseIntPipe } from '@nestjs/common';
import { QuizService } from './quiz.service';

@Controller('api/quizzes')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post('generate')
  async createQuiz(
    @Body('document_id', ParseIntPipe) documentId: number, // ใช้ ParseIntPipe เพื่อแปลงเป็นตัวเลขชัวร์ๆ
    @Body('extracted_text') extractedText: string,
    @Body('num_questions') numQuestions: number,
  ) {
    return this.quizService.generateAndSaveQuiz(
      extractedText,
      numQuestions || 3, // ถ้าไม่ส่งมา ให้ดีฟอลต์เป็น 3 ข้อ
      documentId,
    );
  }
}
