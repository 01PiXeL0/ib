"use client";

import { Button, Card, CardBody, CardHeader, Chip, Input, Textarea } from "@heroui/react";
import { useState, type FormEvent } from "react";
import { useAuthModal } from "./components/auth-modal-context";

const stats = [
  { label: "Направлений", value: "18", detail: "от аналитики до биотеха" },
  { label: "Тестов пройдено", value: "340+", detail: "за последний месяц" },
  { label: "Чатов сопровождения", value: "48", detail: "с персональными планами" },
];

const flows = [
  {
    title: "Собираем профиль",
    body: "Возраст, опыт, интересы и «красные линии». Эти данные задают стартовый вектор.",
  },
  {
    title: "Проходим тест",
    body: "Комбинированный скринер: ценности, навыки, свободный ввод и сценарии. Ведёт к устойчивым рекомендациям.",
  },
  {
    title: "Генерируем подборку ролей",
    body: "Сопоставляем ответы с базой профессий, показываем топ‑5 и сразу даём инструменты для действий.",
  },
  {
    title: "Подхватываем в чате",
    body: "Ассистент объясняет, зачем именно эти роли и какие шаги потребуются. Все диалоги сохраняются в профиль.",
  },
];

const profCollections = [
  { title: "Data · Аналитика", roles: ["Product Analyst", "Data Engineer", "BI Lead"], tags: ["SQL", "Python", "BI"] },
  { title: "AI / ML", roles: ["ML Engineer", "MLOps", "Prompt Architect"], tags: ["LLM", "PyTorch", "MLOps"] },
  { title: "Продукты и дизайн", roles: ["Product Manager", "UX Lead", "Service Designer"], tags: ["Discovery", "Сценарии", "Команды"] },
];

const contactInitial = { name: "", email: "", message: "" };

export default function Home() {
  const { openModal } = useAuthModal();
  const [contact, setContact] = useState(contactInitial);
  const [contactStatus, setContactStatus] = useState<string | null>(null);

  const handleContactSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!contact.email || !contact.message) {
      setContactStatus("Заполните email и сообщение");
      return;
    }
    setContactStatus("Спасибо! Ответим в течение рабочего дня.");
    setContact(contactInitial);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-24 px-5 pb-24 pt-24" id="hero">
        <section className="grid gap-12 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.3em] text-zinc-400">
              Career Compass
            </div>
            <div className="space-y-6">
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                Профориентация с подборкой профессий, кастомным тестом и сопровождением
            </h1>
            <p className="text-lg text-zinc-300">
                Вводим данные, проходим тест — сразу получаем роли, причины выбора и план по переходу. Дальше подключается чат с наставником.
            </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button color="primary" size="lg" className="font-semibold" onPress={() => openModal("register")}>
                Создать профиль
              </Button>
              <Button variant="bordered" size="lg" as="a" href="/assessment">
                Пройти тест
              </Button>
              <Button variant="light" size="lg" as="a" href="/chat">
                Открыть чат
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {stats.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-5">
                  <p className="text-2xl font-semibold text-white">{item.value}</p>
                  <p className="text-xs uppercase tracking-wide text-zinc-400">{item.label}</p>
                  <p className="text-xs text-zinc-500">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <Card className="border border-white/15 bg-gradient-to-br from-white/10 via-white/5 to-transparent">
            <CardHeader className="flex flex-col gap-1">
              <p className="text-sm uppercase tracking-[0.4em] text-zinc-400">Roadmap</p>
              <p className="text-2xl font-semibold">Путь студента</p>
            </CardHeader>
            <CardBody className="space-y-4">
              {flows.map((flow, idx) => (
                <div key={flow.title} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="flex items-center gap-3">
                    <Chip size="sm" variant="flat" color="primary">
                      {idx + 1}
                    </Chip>
                    <p className="font-semibold">{flow.title}</p>
                  </div>
                  <p className="mt-2 text-sm text-zinc-400">{flow.body}</p>
                </div>
              ))}
            </CardBody>
          </Card>
        </section>

        <section id="collections" className="space-y-8">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-zinc-500">Подборки профессий</p>
            <h2 className="text-3xl font-semibold">Роли, к которым ведёт тест</h2>
            <p className="text-zinc-400">Каждой подборке соответствует свой маршрут обучения и набор кейсов. После теста показываем релевантные коллекции и объясняем выбор.</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {profCollections.map((collection) => (
              <Card key={collection.title} className="border border-white/10 bg-white/[0.04]">
                <CardHeader className="flex flex-col gap-1">
                  <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">Коллекция</p>
                  <p className="text-xl font-semibold">{collection.title}</p>
                </CardHeader>
                <CardBody className="space-y-3 text-sm text-zinc-300">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Роли</p>
                    <ul className="mt-2 space-y-1">
                      {collection.roles.map((role) => (
                        <li key={role} className="rounded-xl bg-black/30 px-3 py-2">
                          {role}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {collection.tags.map((tag) => (
                      <Chip key={tag} variant="flat" color="secondary" className="text-xs">
                        {tag}
                      </Chip>
                    ))}
                  </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </section>

        <section id="flows" className="space-y-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-зinc-500">Как это работает</p>
              <h2 className="text-3xl font-semibold">Онбординг, тест, подборка, сопровождение</h2>
              <p className="text-zinc-400">От сбора данных до объяснённого списка профессий и плана действий. Всё в одном потоке, без прыжков по сервисам.</p>
            </div>
            <Button color="primary" variant="flat" onPress={() => openModal("login")}>
              Войти
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border border-white/10 bg-white/[0.03]">
              <CardHeader className="text-lg font-semibold">Сбор профиля</CardHeader>
              <CardBody className="text-sm text-zinc-400">Импорт из таблиц или ручной ввод. Фиксируем мотивацию, ограничения, желаемые отрасли.</CardBody>
            </Card>
            <Card className="border border-white/10 bg-white/[0.03]">
              <CardHeader className="text-lg font-semibold">Тест и скринер</CardHeader>
              <CardBody className="text-sm text-zinc-400">Комбинируем рейтинговые вопросы, открытые ответы и сценарии. Сразу считаем snapshot для рекомендаций.</CardBody>
            </Card>
            <Card className="border border-white/10 bg-white/[0.03]">
              <CardHeader className="text-lg font-semibold">Подборка + чат</CardHeader>
              <CardBody className="text-sm text-zinc-400">На основе данных выводим роли, объясняем выбор, подпираем ссылками и включаем чат-наставника.</CardBody>
            </Card>
          </div>
        </section>

        <section id="contacts" className="rounded-3xl border border-white/10 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr,1.1fr]">
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm uppercase tracking-[0.4em] text-zinc-500">Контакты</p>
                <h2 className="text-3xl font-semibold text-white">Расскажите о задаче — ответим за день</h2>
                <p className="text-zinc-400">
                  Настроим тест, кастомизируем визуал и подключим API к вашим сервисам. Можно описать задачу в свободной форме или оставить ссылку на бриф.
                </p>
              </div>
              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <p className="text-sm uppercase text-zinc-500">Email</p>
                  <p className="text-2xl font-semibold text-white">team@devbasics.ru</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <p className="text-sm uppercase text-zinc-500">Telegram</p>
                  <p className="text-2xl font-semibold text-white">@devbasics</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-zinc-400">
                <Chip variant="flat" color="primary">
                  NDA по запросу
                </Chip>
                <Chip variant="flat" color="secondary">
                  10:00 — 20:00 МСК
                </Chip>
              </div>
            </div>
            <Card className="border border-white/10 bg-white/[0.02]">
              <CardHeader className="text-lg font-semibold">Форма связи</CardHeader>
              <CardBody>
                <form className="space-y-4" onSubmit={handleContactSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input label="Имя" placeholder="Ирина" value={contact.name} onChange={(e) => setContact((prev) => ({ ...prev, name: e.target.value }))} />
                    <Input
                      label="Email"
                      placeholder="name@company.com"
                      type="email"
                      value={contact.email}
                      onChange={(e) => setContact((prev) => ({ ...prev, email: e.target.value }))}
                      isRequired
                    />
                  </div>
                  <Textarea
                    label="Задача"
                    placeholder="Например, интегрировать тест в карьерный сайт"
                    value={contact.message}
                    onChange={(e) => setContact((prev) => ({ ...prev, message: e.target.value }))}
                    minRows={5}
                  />
                  <Button type="submit" color="primary" className="w-full font-semibold">
                    Отправить
                  </Button>
                  {contactStatus && <p className="text-sm text-emerald-300">{contactStatus}</p>}
                </form>
              </CardBody>
            </Card>
          </div>
        </section>
        </main>
    </div>
  );
}
