"use client";

import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Input,
  Radio,
  RadioGroup,
  Switch,
  Textarea,
} from "@heroui/react";
import { useState } from "react";
import { useAuthModal } from "../components/auth-modal-context";

const accentOptions = [
  { label: "Индиго", value: "indigo" },
  { label: "Фиолетовый", value: "purple" },
  { label: "Циан", value: "cyan" },
];

const accentBadge: Record<string, string> = {
  indigo: "bg-indigo-500/20 text-indigo-200 border border-indigo-400/40",
  purple: "bg-purple-500/20 text-purple-200 border border-purple-400/40",
  cyan: "bg-cyan-500/20 text-cyan-200 border border-cyan-400/50",
};

const statCards = [
  { label: "Пройдено тестов", value: "3", detail: "последний — сегодня" },
  { label: "Сохранено чатов", value: "5", detail: "2 активных диалога" },
  { label: "Черновики профиля", value: "2", detail: "готовы к отправке" },
];

export default function ProfilePage() {
  const { user, openModal, logout } = useAuthModal();
  const [tagline, setTagline] = useState("Product Analyst · Middle");
  const [bio, setBio] = useState("Изучаю аналитику данных, подключаю ML и люблю делать понятные интерфейсы.");
  const [notifications, setNotifications] = useState(true);
  const [accent, setAccent] = useState<"indigo" | "purple" | "cyan">("indigo");
  const [status, setStatus] = useState<string | null>(null);

  const handleSave = () => {
    setStatus("Настройки обновлены. Будет синхронизировано при следующей сессии.");
    setTimeout(() => setStatus(null), 2500);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <main className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-32">
          <Card className="border border-white/10 bg-white/[0.02] p-8 text-center">
            <CardHeader className="flex flex-col gap-3 text-center">
              <p className="text-sm uppercase tracking-[0.4em] text-zinc-500">Профиль</p>
              <h1 className="text-4xl font-semibold">Войдите, чтобы увидеть персональные данные</h1>
            </CardHeader>
            <CardBody className="space-y-6 text-zinc-400">
              <p>Тут появятся сохранённые тесты, настройки темы и история чатов. Нажмите кнопку ниже, чтобы открыть модальное окно входа.</p>
              <Button color="primary" size="lg" className="font-semibold" onPress={() => openModal("login")}>
                Войти или зарегистрироваться
              </Button>
            </CardBody>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-5 pb-24 pt-20">
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900/40 p-10">
          <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-gradient-to-l from-indigo-500/30 via-transparent to-transparent blur-3xl lg:block" />
          <div className="flex flex-wrap items-center gap-8">
            <Avatar
              size="lg"
              name={user.name || user.email}
              className={`h-24 w-24 text-xl font-semibold ${accentBadge[accent]}`}
            />
            <div className="space-y-1">
              <p className="text-sm uppercase tracking-[0.4em] text-zinc-400">Профиль</p>
              <h1 className="text-4xl font-semibold">{user.name || "Без имени"}</h1>
              <p className="text-zinc-300">{user.email}</p>
              <p className="text-zinc-400">{tagline}</p>
            </div>
            <div className="ml-auto flex flex-wrap gap-3">
              <Button variant="bordered" color="secondary" as="a" href="/assessment">
                Пройти тест
              </Button>
              <Button variant="flat" color="primary" as="a" href="/chat">
                Продолжить чат
              </Button>
              <Button variant="light" color="danger" onPress={logout}>
                Выйти
              </Button>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {statCards.map((stat) => (
            <Card key={stat.label} className="border border-white/10 bg-white/[0.03]">
              <CardBody className="space-y-2">
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">{stat.label}</p>
                <p className="text-4xl font-semibold text-white">{stat.value}</p>
                <p className="text-sm text-zinc-400">{stat.detail}</p>
              </CardBody>
            </Card>
          ))}
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
          <Card className="border border-white/10 bg-white/[0.02]">
            <CardHeader className="flex flex-col gap-2">
              <p className="text-sm uppercase tracking-[0.4em] text-zinc-500">Основные данные</p>
              <h2 className="text-2xl font-semibold">Информация и заметки</h2>
            </CardHeader>
            <CardBody className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300" htmlFor="tagline">
                  Теглайн
                </label>
                <input
                  id="tagline"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/40"
                  placeholder="Например, аналитик данных, middle"
                />
              </div>
              <Textarea
                label="О себе"
                minRows={5}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
              <Switch isSelected={notifications} onValueChange={setNotifications}>
                Присылать обновления и PDF отчёты
              </Switch>
              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="border border-white/10 bg-black/30 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Последний тест</p>
                  <p className="text-lg font-semibold text-white">"Навыки · ноябрь"</p>
                </Card>
                <Card className="border border-white/10 bg-black/30 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Последний чат</p>
                  <p className="text-lg font-semibold text-white">"ML переход"</p>
                </Card>
              </div>
            </CardBody>
          </Card>

          <Card className="border border-white/10 bg-white/[0.03]">
            <CardHeader className="flex flex-col gap-2">
              <p className="text-sm uppercase tracking-[0.4em] text-zinc-500">Кастомизация</p>
              <h2 className="text-2xl font-semibold">Тема и акценты</h2>
            </CardHeader>
            <CardBody className="space-y-5">
              <RadioGroup
                label="Цвет акцента"
                value={accent}
                onValueChange={(val) => setAccent(val as typeof accent)}
                orientation="vertical"
              >
                {accentOptions.map((option) => (
                  <Radio key={option.value} value={option.value}>
                    {option.label}
                  </Radio>
                ))}
              </RadioGroup>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-zinc-400">
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Предпросмотр</p>
                <p className="mt-2">Так будет выглядеть акцент в модалках, кнопках и карточках. Сохраните, чтобы применить.</p>
                <Chip className={`mt-4 ${accentBadge[accent]}`}>Accent preview</Chip>
              </div>
              <Button color="primary" className="w-full font-semibold" onPress={handleSave}>
                Сохранить изменения
              </Button>
              {status && <p className="text-sm text-emerald-300">{status}</p>}
            </CardBody>
          </Card>
        </section>
      </main>
    </div>
  );
}

