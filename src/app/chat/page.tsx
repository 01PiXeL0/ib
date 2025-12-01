"use client";

import { Button, Card, CardBody, CardHeader, Chip, Textarea } from "@heroui/react";
import { useState, useTransition } from "react";
import { useAuthModal } from "../components/auth-modal-context";

type Message = { role: "user" | "assistant"; content: string; time: string };

const starterMessages: Message[] = [
  { role: "assistant", content: "Привет! Я запомнил твой выбор в тесте: IT / Data и высокий интерес к креативности.", time: "09:41" },
  { role: "assistant", content: "Готов подсказать следующие шаги или предложить альтернативы. С чего начнём?", time: "09:42" },
];

const quickPrompts = ["Где развивать навык ML?", "Какие роли близки к дизайну?", "Как прокачать софт-скиллы?"];

export default function ChatPage() {
  const { openModal } = useAuthModal();
  const [messages, setMessages] = useState<Message[]>(starterMessages);
  const [input, setInput] = useState("");
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    const now = new Date();
    const timestamp = now.toLocaleTimeString().slice(0, 5);
    const userMessage: Message = { role: "user", content: input.trim(), time: timestamp };
    const assistantMessage: Message = {
      role: "assistant",
      content: "Фиксирую. Я могу сохранить это в заметки профиля или предложить следующее упражнение.",
      time: timestamp,
    };
    const nextMessages = [...messages, userMessage, assistantMessage];
    setMessages(nextMessages);
    setInput("");
  };

  const saveChat = () => {
    setStatus(null);
    setError(null);
    startTransition(async () => {
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcript: messages, summary: "Кандидат обсуждал варианты развития" }),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.error || "Не удалось сохранить чат");
        setStatus(`Чат сохранён (#${json.chat.id})`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка");
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-5 pb-20 pt-20">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.4em] text-zinc-500">Чат сопровождения</p>
            <h1 className="text-4xl font-semibold leading-tight">Диалог после теста</h1>
            <p className="text-lg text-zinc-300">Ассистент знает ответы кандидата и предлагает шаги. Чат дружит с любым LLM.</p>
          </div>
          <Button color="primary" variant="flat" onPress={() => openModal("login")}>
            Войти
          </Button>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
          <Card className="border border-white/10 bg-white/[0.03]">
            <CardHeader className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">История</p>
                <p className="text-xl font-semibold">Последние сообщения</p>
              </div>
              <Chip color="success" variant="flat">
                online
              </Chip>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="space-y-4 rounded-2xl border border-white/10 bg-black/30 p-4">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`rounded-2xl p-3 ${msg.role === "assistant" ? "bg-white/[0.08]" : "bg-indigo-500/20 text-indigo-100"}`}>
                    <div className="flex items-center justify-between text-xs uppercase tracking-wide text-zinc-400">
                      <span>{msg.role === "assistant" ? "Ассистент" : "Вы"}</span>
                      <span>{msg.time}</span>
                    </div>
                    <p className="mt-2 text-sm">{msg.content}</p>
                  </div>
                ))}
              </div>
              <Textarea
                label="Сообщение"
                placeholder="Спроси про роли, план обучения или soft skills"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <div className="flex flex-wrap gap-3">
                <Button color="primary" onPress={handleSend} isDisabled={pending}>
                  Отправить
                </Button>
                <Button variant="bordered" onPress={saveChat} isDisabled={pending}>
                  Сохранить диалог
                </Button>
              </div>
              {status && <p className="text-sm font-semibold text-emerald-400">{status}</p>}
              {error && <p className="text-sm font-semibold text-rose-400">{error}</p>}
            </CardBody>
          </Card>

          <div className="space-y-6">
            <Card className="border border-white/10 bg-white/[0.02]">
              <CardHeader className="text-lg font-semibold">Быстрые подсказки</CardHeader>
              <CardBody className="flex flex-wrap gap-2">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    className="rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:border-white/40"
                    onClick={() => setInput((prev) => (prev ? `${prev} ${prompt}` : prompt))}
                  >
                    {prompt}
                  </button>
                ))}
              </CardBody>
            </Card>
            <Card className="border border-white/10 bg-white/[0.04]">
              <CardHeader className="text-lg font-semibold">Что происходит с данными</CardHeader>
              <CardBody className="space-y-2 text-sm text-zinc-300">
                <p>• Каждое сообщение можно пометить тегами и приложить к профилю кандидата.</p>
                <p>• Диалог запускается с контекстом последнего теста и рекомендациями.</p>
                <p>• Готово к подключению вебхуков или собственного хранилища.</p>
              </CardBody>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
