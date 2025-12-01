import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

type AssessmentPayload = {
  userId?: number;
  screening?: {
    areas?: string[];
    workFocus?: string;
    workStyle?: string;
    studyDepth?: string;
    constraints?: string;
  };
  motivations?: {
    values?: Record<string, number>;
    skills?: string[];
    learningPlan?: string[];
    freeText?: string;
  };
  featureSnapshot?: Record<string, unknown>;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AssessmentPayload;
    const assessment = await prisma.assessment.create({
      data: {
        userId: body.userId,
        areas: body.screening?.areas || [],
        workFocus: body.screening?.workFocus,
        workStyle: body.screening?.workStyle,
        studyDepth: body.screening?.studyDepth,
        constraints: body.screening?.constraints,
        values: body.motivations?.values,
        skills: body.motivations?.skills,
        learningPlan: body.motivations?.learningPlan,
        freeText: body.motivations?.freeText,
        snapshot: body.featureSnapshot,
      },
      select: {
        id: true,
        createdAt: true,
        areas: true,
        workFocus: true,
        workStyle: true,
        studyDepth: true,
      },
    });

    return NextResponse.json({ message: "Оценка сохранена", assessment });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Не удалось сохранить оценку" }, { status: 500 });
  }
}
