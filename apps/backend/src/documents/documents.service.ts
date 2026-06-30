import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PDFParse } from 'pdf-parse';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  async uploadAndExtractFile(file: Express.Multer.File, userId: number) {
    if (!file) {
      throw new BadRequestException('กรุณาอัปโหลดไฟล์ด้วยครับ');
    }

    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('ระบบรองรับเฉพาะไฟล์ PDF ในขณะนี้ครับ');
    }

    let extractedText = '';
    try {
      const parser = new PDFParse({ data: file.buffer });
      const result = await parser.getText();
      extractedText = result.text;
    } catch {
      throw new BadRequestException(
        'ไม่สามารถอ่านเนื้อหาจากไฟล์ PDF นี้ได้ครับ',
      );
    }

    extractedText = extractedText.replace(/\s+/g, ' ').trim();

    const newDocument = await this.prisma.document.create({
      data: {
        userId,
        fileName: file.originalname,
        filePath: `uploads/${Date.now()}-${file.originalname}`,
        extractedText,
      },
    });

    return {
      message: 'อัปโหลดและสกัดข้อความสำเร็จ',
      documentId: newDocument.id,
      fileName: newDocument.fileName,
      characterCount: extractedText.length,
    };
  }
}
