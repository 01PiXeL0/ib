import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

type ChatPayload = {
  userId?: number;
  assessmentId?: number;
  transcript: { role: "user" | "assistant"; content: string }[];
  summary?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatPayload;
    if (!body?.transcript?.length) {
      return NextResponse.json({ error: "Нужен хотя бы один обмен сообщениями" }, { status: 400 });
    }

    const chat = await prisma.chatSession.create({
      data: {
        userId: body.userId,
        assessmentId: body.assessmentId,
        transcript: body.transcript,
        summary: body.summary,
      },
      select: { id: true, createdAt: true, assessmentId: true },
    });

    return NextResponse.json({ message: "Чат сохранён", chat });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Не удалось сохранить чат" }, { status: 500 });
  }
}
