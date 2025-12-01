"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  CheckboxGroup,
  Input,
  Progress,
  Radio,
  RadioGroup,
  Slider,
  Textarea,
} from "@heroui/react";
import { useMemo, useState, useTransition } from "react";
import { useAuthModal } from "../components/auth-modal-context";

const areas = ["IT / Data / AI", "Медицина", "Экономика", "Инжиниринг", "Креатив", "Образование", "Экология", "Новые роли"];
const valueKeys = [
  { key: "autonomy", label: "Независимость" },
  { key: "stability", label: "Стабильность" },
  { key: "impact", label: "Польза" },
  { key: "income", label: "Доход" },
  { key: "creativity", label: "Креативность" },
];

export default function AssessmentPage() {
  const { openModal } = useAuthModal();
  const [profile, setProfile] = useState({ name: "", email: "", level: "" });
  const [selectedAreas, setSelectedAreas] = useState<string[]>(["IT / Data / AI"]);
  const [workFocus, setWorkFocus] = useState("данные");
  const [workStyle, setWorkStyle] = useState("удалённо");
  const [studyDepth, setStudyDepth] = useState("быстрый старт");
  const [values, setValues] = useState<Record<string, number>>({ autonomy: 60, stability: 55, impact: 65, income: 70, creativity: 75 });
  const [skills, setSkills] = useState("SQL, Python, Аналитика");
  const [learningPlan, setLearningPlan] = useState("SQL → Python → портфолио");
  const [freeText, setFreeText] = useState("Хочу работать с продуктами и данными");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const featureSnapshot = useMemo(
    () => ({
      data_affinity: workFocus === "данные" ? 1 : 0.6,
      people_focus: workFocus === "люди" ? 1 : 0.4,
      autonomy: values.autonomy / 100,
      stability: values.stability / 100,
      creativity: values.creativity / 100,
      impact: values.impact / 100,
      income: values.income / 100,
    }),
    [values, workFocus],
  );

  const recommendation = useMemo(() => {
    const topValue = Object.entries(values).sort((a, b) => b[1] - a[1])[0];
    return `${workFocus === "данные" ? "Инженерия данных" : "Продуктовая роль"} · главный мотив — ${topValue?.[0] ?? "рост"}.`;
  }, [values, workFocus]);

  const handleSubmit = () => {
    setStatus(null);
    setError(null);
    startTransition(async () => {
      try {
        const response = await fetch("/api/assessments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            profile,
            screening: { areas: selectedAreas, workFocus, workStyle, studyDepth },
            motivations: {
              values,
              skills: skills
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
              learningPlan: learningPlan
                .split("→")
                .map((item) => item.trim())
                .filter(Boolean),
              freeText,
            },
            featureSnapshot,
          }),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.error || "Не удалось сохранить оценку");
        setStatus(`Готово, ID ${json.assessment.id}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка");
      }
    });
  };

  const progressValue = useMemo(() => {
    const filledInputs = [profile.name, profile.email, profile.level, skills, learningPlan, freeText].filter((item) => item.trim().length > 0).length;
    return Math.min(100, (filledInputs / 6) * 60 + selectedAreas.length * 5);
  }, [profile, skills, learningPlan, freeText, selectedAreas]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-5 pb-20 pt-20">
        <header className="space-y-4">
          <p className="text-sm uppercase tracking-[0.4em] text-zinc-500">Тест</p>
          <h1 className="text-4xl font-semibold leading-tight">Анкета кандидата</h1>
          <p className="text-lg text-zinc-300">Отвечаете — справа сразу растёт рекомендация. После отправки данные доступны в административной панели.</p>
          <Progress aria-label="Прогресс заполнения" value={progressValue} className="max-w-sm" color="primary" />
        </header>

        <div className="grid gap-8 lg:grid-cols-[1.3fr,0.7fr]">
          <div className="space-y-8">
            <Card className="border border-white/10 bg-white/[0.03]">
              <CardHeader className="text-lg font-semibold">Профиль</CardHeader>
              <CardBody className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  <Input label="Имя" placeholder="Анна" value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} />
                  <Input label="Email" placeholder="user@mail.com" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} />
                  <Input label="Уровень" placeholder="Студент / Middle / Senior" value={profile.level} onChange={(e) => setProfile((p) => ({ ...p, level: e.target.value }))} />
                </div>
                <CheckboxGroup label="Интересующие сферы" value={selectedAreas} onChange={(items) => setSelectedAreas(items as string[])}>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {areas.map((area) => (
                      <Checkbox key={area} value={area}>
                        {area}
                      </Checkbox>
                    ))}
                  </div>
                </CheckboxGroup>
                <div className="grid gap-4 lg:grid-cols-3">
                  <RadioGroup label="Основной фокус" value={workFocus} onValueChange={setWorkFocus} orientation="vertical">
                    <Radio value="данные">Данные</Radio>
                    <Radio value="люди">Команды</Radio>
                    <Radio value="оборудование">Инженерия</Radio>
                  </RadioGroup>
                  <RadioGroup label="Формат" value={workStyle} onValueChange={setWorkStyle} orientation="vertical">
                    <Radio value="офис">Офис</Radio>
                    <Radio value="гибрид">Гибрид</Radio>
                    <Radio value="удалённо">Удалённо</Radio>
                    <Radio value="полевой">Полевой</Radio>
                  </RadioGroup>
                  <RadioGroup label="Темп обучения" value={studyDepth} onValueChange={setStudyDepth} orientation="vertical">
                    <Radio value="быстрый старт">Быстрый старт</Radio>
                    <Radio value="долгая учёба">Глубокое обучение</Radio>
                    <Radio value="гибко">Гибридный путь</Radio>
                  </RadioGroup>
                </div>
              </CardBody>
            </Card>

            <Card className="border border-white/10 bg-white/[0.03]">
              <CardHeader className="text-lg font-semibold">Ценности</CardHeader>
              <CardBody className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  {valueKeys.map((item) => (
                    <div key={item.key} className="space-y-1 rounded-xl border border-white/10 bg-black/30 p-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>{item.label}</span>
                        <span className="text-xs text-zinc-400">{values[item.key] ?? 0}%</span>
                      </div>
                      <Slider value={values[item.key] ?? 0} onChange={(val) => setValues((prev) => ({ ...prev, [item.key]: val as number }))} />
                    </div>
                  ))}
                </div>
                <Input label="Навыки" placeholder="SQL, Figma, преподавание" value={skills} onChange={(e) => setSkills(e.target.value)} />
                <Input label="План обучения" placeholder="SQL → Python → проекты" value={learningPlan} onChange={(e) => setLearningPlan(e.target.value)} />
                <Textarea
                  label="Что важно"
                  placeholder="Например, хочу работать с продуктовой командой и развивать аналитику"
                  value={freeText}
                  onChange={(e) => setFreeText(e.target.value)}
                  minRows={4}
                />
                <div className="flex flex-wrap gap-3">
                  <Button color="primary" onPress={handleSubmit} isDisabled={pending}>
                    {pending ? "Сохраняем..." : "Отправить результат"}
                  </Button>
                  <Button variant="flat" color="secondary" onPress={() => openModal("login")}>
                    Войти
                  </Button>
                </div>
                {status && <p className="text-sm font-semibold text-emerald-400">{status}</p>}
                {error && <p className="text-sm font-semibold text-rose-400">{error}</p>}
              </CardBody>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border border-white/10 bg-white/[0.04]">
              <CardHeader className="text-lg font-semibold">Предварительная рекомендация</CardHeader>
              <CardBody className="space-y-3 text-sm text-zinc-300">
                <p className="text-xl font-semibold text-white">{recommendation}</p>
                <p>Рабочий формат: {workStyle}. Темп обучения: {studyDepth}.</p>
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Snapshot</p>
                <pre className="rounded-xl bg-black/50 p-3 text-xs text-emerald-200">{JSON.stringify(featureSnapshot, null, 2)}</pre>
              </CardBody>
            </Card>

            <Card className="border border-white/10 bg-white/[0.02]">
              <CardHeader className="text-lg font-semibold">Советы по прохождению</CardHeader>
              <CardBody className="space-y-2 text-sm text-zinc-400">
                <p>• Отвечайте последовательностями — система сразу строит план обучения.</p>
                <p>• Можно сохранять черновик и вернуться позже.</p>
                <p>• После отправки доступен экспорт PDF и передача в чат сопровождения.</p>
              </CardBody>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
