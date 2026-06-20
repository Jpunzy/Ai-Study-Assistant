import axios from 'axios';
import { HttpService } from '@nestjs/axios';
import {
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
    extractedText: string,
    numQuestions: number,
    documentId: number,
  ) {
    const baseUrl = process.env.AI_SERVICE_URL ?? 'http://localhost:8000';
    const fastapiUrl = `${baseUrl}/api/ai/generate-quiz`;
    const payload = {
      extracted_text: extractedText,
      num_questions: numQuestions,
    };

    let aiResponseData: ApiQuizResponse;
    try {
      const response = await firstValueFrom(
        this.httpService.post<ApiQuizResponse>(fastapiUrl, payload, {
          timeout: AI_SERVICE_TIMEOUT_MS,
        }),
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
    const documentIdExists = await this.prisma.document.findUnique({
      where: { id: documentId },
    });
    if (!documentIdExists) {
      throw new NotFoundException(
        `ไม่พบเอกสารรหัส ID: ${documentId} ในระบบ ไม่สามารถสร้างข้อสอบได้ครับ`,
      );
    }
    const savedQuiz = await this.prisma.quiz.create({
      data: {
        documentId: documentId,
        quizData: aiResponseData.quizzes as unknown as Prisma.InputJsonValue,
      },
    });

    return {
      message: 'Quiz generated and saved successfully',
      data: savedQuiz,
    };
  }
  async getMyQuizzes(userId: number) {
    return this.prisma.quiz.findMany({
      where: {
        document: { userId },
      },
      include: {
        document: {
          select: { id: true, fileName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
