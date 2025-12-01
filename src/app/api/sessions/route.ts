import { NextResponse } from "next/server";

import { insertRecord } from "@/lib/supabaseClient";

type SessionPayload = {
  profile: {
    name: string;
    email?: string;
    ageGroup?: string;
    location?: string;
    education?: string;
  };
  screening: {
    areas: string[];
    workFocus: string;
    workStyle: string;
    studyDepth: string;
    constraints?: string;
  };
  motivations: {
    values: Record<string, number>;
    freeText?: string;
    skills?: string[];
    learningPlan?: string[];
  };
  roadmap?: string[];
  featureSnapshot: Record<string, number>;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SessionPayload;

    const sessionId = crypto.randomUUID();
    const startedAt = new Date().toISOString();
    const { profile, screening, motivations, roadmap = [], featureSnapshot } = body;

    const summary = {
      sessionId,
      headline: `${profile.name || "Новая сессия"}: ${screening.areas.join(", ") || "области не выбраны"}`,
      highlights: [
        `Формат работы: ${screening.workStyle}`,
        `Фокус: ${screening.workFocus}`,
        `Учебный путь: ${screening.studyDepth}`,
      ],
      values: motivations.values,
      roadmap,
    };

    const sessionRecord = await insertRecord({
      table: "sessions",
      payload: {
        id: sessionId,
        user_name: profile.name,
        email: profile.email,
        age_group: profile.ageGroup,
        location: profile.location,
        education: profile.education,
        screening,
        motivations,
        feature_snapshot: featureSnapshot,
        summary,
        started_at: startedAt,
      },
    });

    const answersRecord = await insertRecord({
      table: "answers",
      payload: {
        session_id: sessionId,
        answers_json: body,
        created_at: startedAt,
      },
    });

    return NextResponse.json({ session: sessionRecord?.[0] ?? sessionRecord, answers: answersRecord?.[0] ?? answersRecord });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
