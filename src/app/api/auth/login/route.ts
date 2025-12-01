import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { verifyPassword } from "../register/route";

type Body = {
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;
    if (!body.email || !body.password) {
      return NextResponse.json({ error: "Нужны email и пароль" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
    }

    const valid = verifyPassword(body.password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Неверный пароль" }, { status: 401 });
    }

    const profile = { id: user.id, email: user.email, name: user.name };
    return NextResponse.json({ message: "Вход выполнен", user: profile });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
