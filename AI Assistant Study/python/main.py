from typing import List
import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from openai import AsyncOpenAI

# 1. เริ่มต้นระบบ FastAPI และ OpenAI Client
app = FastAPI(title="AI Study Assistant - Core AI Service")
load_dotenv()
client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class QuizItem(BaseModel):
    question: str = Field(description="โจทย์คำนวณหรือวิเคราะห์เชิงลึก")
    options: List[str] = Field(description="ตัวเลือกปรนัย 4 ตัวเลือก")
    answer: str = Field(description="ข้อความของตัวเลือกที่ถูกต้องตรงเป๊ะๆ")
    explanation: str = Field(description="อธิบายวิธีคิดคำนวณทีละสเต็ปอย่างละเอียด")

class QuizResponseSchema(BaseModel):
    quizzes: List[QuizItem]
# 2. สร้างโครงสร้างข้อมูลสำหรับรับเข้า (Request Body) 
# ตัวนี้จะบอกว่า NestJS ต้องยิงก้อน Object ที่มีหน้าตาแบบไหนมาให้ Python
class StudyMaterialRequest(BaseModel):
    extracted_text: str
    num_questions: int = 3  # จำนวนข้อสอบที่ต้องการ (ดีฟอลต์เป็น 3 ข้อ)

# 3. สร้าง Endpoint (ทางเข้าออกข้อมูล) แบบ POST เพื่อรอรับงาน
@app.post("/api/ai/generate-quiz")
async def generate_quiz(request: StudyMaterialRequest):
    # ป้องกันกรณีที่ส่งข้อความว่างเปล่าเข้ามา
    if not request.extracted_text.strip():
        raise HTTPException(status_code=400, detail="Text content cannot be empty")
        
    try:
        # 4. เรียกใช้งาน OpenAI API เพื่อเจนข้อสอบ
        response = await client.beta.chat.completions.parse(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "คุณคือศาสตราจารย์คณะวิศวกรรมคอมพิวเตอร์ "
                        f"จงนำเนื้อหาที่ได้รับไปออกข้อสอบคำนวณหรือวิเคราะห์เชิงลึกแบบปรนัย 4 ตัวเลือก จำนวน {request.num_questions} ข้อ"
                    )
                },
                {
                    "role": "user",
                    "content": f"เนื้อหาบทเรียน: {request.extracted_text}"
                }
            ],
            response_format=QuizResponseSchema,
            temperature=0.3
        )

        #แกะก้อน Object ออกมาส่งกลับ
        quiz_data = response.choices[0].message.parsed 
        return quiz_data 

    except Exception as e:
        # หาก OpenAI ล่ม หรือคิดเลขผิดพลาด ให้ตัดการทำงานและส่ง Error บอกหลังบ้าน
        raise HTTPException(status_code=500, detail=f"AI Generation Failed: {str(e)}")

# 5. ฟังก์ชันสำหรับเช็กสถานะเซิร์ฟเวอร์แบบง่ายๆ
@app.get("/health")
def health_check():
    return {"status": "Python AI Server is running normally!"}