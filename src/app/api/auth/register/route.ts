import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

type Body = {
  email?: string;
  password?: string;
  name?: string;
};

function hashPassword(password: string, salt?: string) {
  const realSalt = salt || randomBytes(16).toString("hex");
  const hash = scryptSync(password, realSalt, 64).toString("hex");
  return `${realSalt}:${hash}`;
}

function verifyPassword(password: string, stored: string) {
  try {
    const [salt, storedHash] = stored.split(":");
    const hash = scryptSync(password, salt, 64).toString("hex");
    return timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(storedHash, "hex"));
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;
    if (!body.email || !body.password) {
      return NextResponse.json({ error: "Нужны email и пароль" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email: body.email } });
    if (existing) {
      return NextResponse.json({ error: "Пользователь уже существует" }, { status: 409 });
    }

    const passwordHash = hashPassword(body.password);
    const user = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
        passwordHash,
      },
      select: { id: true, email: true, name: true, createdAt: true },
    });

    return NextResponse.json({ message: "Аккаунт создан", user });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

// Экспорт для повторного использования в login
export { verifyPassword };
