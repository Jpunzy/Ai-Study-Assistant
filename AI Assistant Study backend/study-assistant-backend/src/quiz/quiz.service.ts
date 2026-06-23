import axios from 'axios';
import { HttpService } from '@nestjs/axios';
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { firstValueFrom } from 'rxjs';
import { Prisma } from '@prisma/client';

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
}
interface ApiQuizResponse {
  quizzes: QuizQuestion[];
}

const AI_SERVICE_TIMEOUT_MS = 30_000;

@Injectable()
export class QuizService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
  ) {}

  async generateAndSaveQuiz(
    documentId: number,
    userId: number,
    numQuestions: number = 3,
  ) {
    // 1. ดึงเอกสารและตรวจสอบสิทธิ์ความเป็นเจ้าของ
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException(`ไม่พบเอกสาร ID: ${documentId}`);
    }

    if (document.userId !== userId) {
      throw new ForbiddenException('คุณไม่มีสิทธิ์สร้างข้อสอบจากเอกสารนี้');
    }

    // 2. เรียก Python AI Service
    const baseUrl = process.env.AI_SERVICE_URL ?? 'http://localhost:8000';
    const payload = {
      extracted_text: document.extractedText,
      num_questions: numQuestions,
    };

    let aiResponseData: ApiQuizResponse;
    try {
      const response = await firstValueFrom(
        this.httpService.post<ApiQuizResponse>(
          `${baseUrl}/api/ai/generate-quiz`,
          payload,
          { timeout: AI_SERVICE_TIMEOUT_MS },
        ),
      );
      aiResponseData = response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new HttpException(
          error.response.data as object,
          error.response.status,
        );
      }
      throw new HttpException(
        `AI service unreachable: ${error instanceof Error ? error.message : String(error)}`,
        HttpStatus.BAD_GATEWAY,
      );
    }

    // 3. บันทึก Quiz ลง Database
    const savedQuiz = await this.prisma.quiz.create({
      data: {
        documentId,
        quizData: aiResponseData.quizzes as unknown as Prisma.InputJsonValue,
      },
      include: {
        document: { select: { id: true, fileName: true } },
      },
    });

    return {
      message: 'สร้างข้อสอบสำเร็จ',
      quizId: savedQuiz.id,
      documentId: savedQuiz.documentId,
      fileName: savedQuiz.document.fileName,
      questionCount: aiResponseData.quizzes.length,
      quizData: savedQuiz.quizData,
    };
  }

  async getMyQuizzes(userId: number) {
    return this.prisma.quiz.findMany({
      where: {
        document: { userId },
      },
      include: {
        document: { select: { id: true, fileName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
