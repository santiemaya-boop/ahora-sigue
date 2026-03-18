"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Play, Pause, SkipForward, RotateCcw } from "lucide-react";

type Mode = "now" | "soon" | "next" | "finished";
type ThemeKey = "green" | "violet" | "blue" | "amber" | "indigo";
type IllustrationKey =
  | "play"
  | "task"
  | "bath"
  | "dinner"
  | "sleep"
  | "soon"
  | "finished";

type Activity = {
  id: string;
  titleNow: string;
  titleSoon: string;
  titleNext: string;
  nextLabel: string;
  afterLabel: string;
  color: ThemeKey;
  illustration: IllustrationKey;
};

const ACTIVITIES: Activity[] = [
  {
    id: "jugar",
    titleNow: "¡Es hora de jugar!",
    titleSoon: "Vamos a hacer\nla tarea",
    titleNext: "¡Vamos a hacer\nla tarea!",
    nextLabel: "Sigue: Hacer tarea",
    afterLabel: "Después: Bañarse",
    color: "green",
    illustration: "play",
  },
  {
    id: "tarea",
    titleNow: "¡Vamos a hacer\nla tarea!",
    titleSoon: "Vamos a bañarnos",
    titleNext: "¡Hora del baño!",
    nextLabel: "Sigue: Bañarse",
    afterLabel: "Después: Cenar",
    color: "blue",
    illustration: "task",
  },
  {
    id: "banarse",
    titleNow: "¡Hora del baño!",
    titleSoon: "Vamos a cenar",
    titleNext: "¡Hora de cenar!",
    nextLabel: "Sigue: Cenar",
    afterLabel: "Después: Dormir",
    color: "violet",
    illustration: "bath",
  },
  {
    id: "cenar",
    titleNow: "¡Hora de cenar!",
    titleSoon: "Vamos a dormir",
    titleNext: "¡Hora de dormir!",
    nextLabel: "Sigue: Dormir",
    afterLabel: "Después: Fin de rutina",
    color: "amber",
    illustration: "dinner",
  },
  {
    id: "dormir",
    titleNow: "¡Hora de dormir!",
    titleSoon: "La rutina termina",
    titleNext: "¡Rutina completada!",
    nextLabel: "Sigue: Fin",
    afterLabel: "Ahora Sigue",
    color: "indigo",
    illustration: "sleep",
  },
];

const THEMES: Record<
  ThemeKey,
  {
    header: string;
    progressBg: string;
    progressFill: string;
    bottom: string;
    text: string;
    accent: string;
    glow: string;
    illustrationBg: string;
  }
> = {
  green: {
    header: "text-sky-400",
    progressBg: "bg-sky-100",
    progressFill: "from-green-300 to-emerald-400",
    bottom: "bg-sky-100",
    text: "text-sky-600",
    accent: "text-sky-600",
    glow: "shadow-[0_18px_40px_rgba(125,211,252,0.22)]",
    illustrationBg: "from-cyan-50 via-white to-sky-50",
  },
  violet: {
    header: "text-slate-400",
    progressBg: "bg-amber-100",
    progressFill: "from-violet-300 to-fuchsia-400",
    bottom: "bg-pink-100",
    text: "text-violet-700",
    accent: "text-violet-700",
    glow: "shadow-[0_18px_40px_rgba(216,180,254,0.22)]",
    illustrationBg: "from-amber-50 via-white to-pink-50",
  },
  blue: {
    header: "text-sky-500",
    progressBg: "bg-sky-100",
    progressFill: "from-sky-400 to-cyan-400",
    bottom: "bg-sky-100",
    text: "text-violet-700",
    accent: "text-violet-700",
    glow: "shadow-[0_18px_40px_rgba(96,165,250,0.20)]",
    illustrationBg: "from-sky-50 via-white to-indigo-50",
  },
  amber: {
    header: "text-amber-400",
    progressBg: "bg-amber-100",
    progressFill: "from-amber-300 to-orange-400",
    bottom: "bg-orange-100",
    text: "text-amber-700",
    accent: "text-amber-700",
    glow: "shadow-[0_18px_40px_rgba(251,191,36,0.20)]",
    illustrationBg: "from-orange-50 via-white to-amber-50",
  },
  indigo: {
    header: "text-indigo-400",
    progressBg: "bg-indigo-100",
    progressFill: "from-indigo-300 to-violet-400",
    bottom: "bg-indigo-100",
    text: "text-indigo-700",
    accent: "text-indigo-700",
    glow: "shadow-[0_18px_40px_rgba(129,140,248,0.20)]",
    illustrationBg: "from-indigo-50 via-white to-violet-50",
  },
};

const ILLUSTRATION_SRC: Record<IllustrationKey, string> = {
  play: "/illustrations/play.png",
  task: "/illustrations/task.png",
  bath: "/illustrations/bath.png",
  dinner: "/illustrations/dinner.png",
  sleep: "/illustrations/sleep.png",
  soon: "/illustrations/soon.png",
  finished: "/illustrations/finished.png",
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getTheme(mode: Mode, activity: Activity) {
  if (mode === "soon") return THEMES.violet;
  if (mode === "next") return THEMES.blue;
  if (mode === "finished") return THEMES.indigo;
  return THEMES[activity.color];
}

function getCardCopy(mode: Mode, activity: Activity) {
  if (mode === "finished") {
    return {
      header: "Ahora Sigue",
      title: "¡Rutina completada!",
      lower: "Terminamos la rutina de hoy",
      illustration: "finished" as IllustrationKey,
    };
  }

  return {
    header: mode === "now" ? "AHORA" : mode === "soon" ? "En breve..." : "Ahora sigue...",
    title: mode === "now" ? activity.titleNow : mode === "soon" ? activity.titleSoon : activity.titleNext,
    lower: mode === "now" ? activity.nextLabel : activity.afterLabel,
    illustration: mode === "soon" ? "soon" : activity.illustration,
  };
}

function Illustration({ kind, alt }: { kind: IllustrationKey; alt: string }) {
  const [errored, setErrored] = useState(false);
  const src = ILLUSTRATION_SRC[kind];

  if (errored) {
    return (
      <div className="flex h-[260px] items-center justify-center rounded-[2rem] border border-dashed border-slate-200 bg-white/60 px-6 text-center text-sm text-slate-400">
        No se pudo cargar la ilustración de “{kind}”.
      </div>
    );
  }

  return (
    <div className="flex h-[260px] items-center justify-center">
      <img
        src={src}
        alt={alt}
        className="max-h-full max-w-full object-contain"
        onError={() => setErrored(true)}
      />
    </div>
  );
}

function BottomIcon({ mode }: { mode: Mode }) {
  const icon = mode === "now" ? "📘" : mode === "finished" ? "✨" : "🛁";
  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-[1rem] bg-gradient-to-br from-orange-50 to-sky-50 text-3xl shadow-sm">
      {icon}
    </div>
  );
}

function MobileCard({
  mode,
  activity,
  progress,
  countdown,
}: {
  mode: Mode;
  activity: Activity;
  progress: number;
  countdown: string;
}) {
  const theme = getTheme(mode, activity);
  const copy = getCardCopy(mode, activity);

  return (
    <div className="mx-auto w-full max-w-[420px]">
      <div
        className={cn(
          "overflow-hidden rounded-[2.25rem] bg-[#fbfbfd] shadow-[0_18px_40px_rgba(15,23,42,0.10)]",
          theme.glow
        )}
      >
        <div className="px-6 pt-8 pb-0 text-center">
          <div className={cn("text-[2.2rem] font-black tracking-tight", theme.header)}>
            {copy.header}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${mode}-${activity.id}`}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.35 }}
            >
              <div className={cn("mt-4 rounded-[2rem] bg-gradient-to-b", theme.illustrationBg)}>
                <Illustration kind={copy.illustration} alt={copy.title.replace(/\n/g, " ")} />
              </div>

              <div
                className={cn(
                  "mt-4 whitespace-pre-line px-3 text-[2rem] font-extrabold leading-tight",
                  theme.accent
                )}
              >
                {copy.title}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 px-2">
            <div className={cn("h-8 rounded-full p-1", theme.progressBg)}>
              <div className="relative h-full overflow-hidden rounded-full bg-white/60">
                <motion.div
                  className={cn("h-full rounded-full bg-gradient-to-r", theme.progressFill)}
                  animate={{ width: `${Math.max(10, Math.min(100, progress * 100))}%` }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />
                <div className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white/80" />
              </div>
            </div>
            <div className="mt-5 text-[1.15rem] text-slate-700">{countdown}</div>
          </div>
        </div>

        <div className={cn("mt-8 px-3 pb-3 pt-7", theme.bottom)}>
          <div className="flex items-center gap-4 rounded-[1.6rem] bg-white px-4 py-4 shadow-[0_10px_20px_rgba(15,23,42,0.08)]">
            <BottomIcon mode={mode} />
            <div className={cn("min-w-0 flex-1 text-[1.05rem] font-bold", theme.text)}>
              {copy.lower}
            </div>
            <ChevronRight className="h-7 w-7 text-slate-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoPanel() {
  return (
    <div className="rounded-[2rem] bg-white p-8 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
      <div className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
        Checklist visual
      </div>
      <div className="mt-3 text-3xl font-black tracking-tight text-slate-800">
        Qué estamos validando en esta demo
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.5rem] bg-sky-50 p-5">
          <div className="text-lg font-extrabold text-sky-500">Ahora</div>
          <p className="mt-2 text-slate-600">
            Ancla la actividad presente con una ilustración grande y lenguaje claro.
          </p>
        </div>
        <div className="rounded-[1.5rem] bg-pink-50 p-5">
          <div className="text-lg font-extrabold text-violet-500">En breve</div>
          <p className="mt-2 text-slate-600">
            Anticipa el cambio sin alarma agresiva ni sobreestimulación.
          </p>
        </div>
        <div className="rounded-[1.5rem] bg-indigo-50 p-5">
          <div className="text-lg font-extrabold text-sky-500">Ahora sigue</div>
          <p className="mt-2 text-slate-600">
            Muestra el nuevo momento con continuidad visual y emocional.
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-[1.5rem] bg-slate-50 p-6">
        <div className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
          Notas para revisión
        </div>
        <ul className="mt-4 space-y-3 text-slate-600">
          <li>• Tarjeta mobile única, centrada y con bordes muy redondeados.</li>
          <li>• Ilustración protagonista por encima del texto y del progreso.</li>
          <li>• Barra gruesa, suave, amigable y visualmente simple.</li>
          <li>• Bloque inferior tipo “sigue” en formato card con sombra suave.</li>
          <li>• Tono visual kawaii / pastel, no SaaS ni productividad adulta.</li>
          <li>• Assets reales en /public/illustrations para respetar la referencia visual.</li>
        </ul>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [index, setIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState<Mode>("now");
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activity = ACTIVITIES[index] ?? ACTIVITIES[ACTIVITIES.length - 1];
  const duration = 12;
  const progress = useMemo(() => elapsed / duration, [elapsed]);

  useEffect(() => {
    if (!running || mode === "finished") return;

    intervalRef.current = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1;

        if (next === 8) setMode("soon");

        if (next >= duration) {
          if (intervalRef.current) clearInterval(intervalRef.current);

          const isLast = index >= ACTIVITIES.length - 1;

          if (isLast) {
            setMode("finished");
            setRunning(false);
            return duration;
          }

          setMode("next");
          timeoutRef.current = setTimeout(() => {
            setIndex((i) => i + 1);
            setElapsed(0);
            setMode("now");
          }, 1800);
        }

        return Math.min(next, duration);
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, index, mode]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function start() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIndex(0);
    setElapsed(0);
    setMode("now");
    setRunning(true);
  }

  function pause() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setRunning(false);
  }

  function nextStep() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const isLast = index >= ACTIVITIES.length - 1;

    if (isLast) {
      setMode("finished");
      setRunning(false);
      return;
    }

    setMode("next");
    timeoutRef.current = setTimeout(() => {
      setIndex((i) => i + 1);
      setElapsed(0);
      setMode("now");
      setRunning(true);
    }, 1400);
  }

  function reset() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setRunning(false);
    setIndex(0);
    setElapsed(0);
    setMode("now");
  }

  const countdown =
    mode === "soon"
      ? "Se termina esta actividad"
      : mode === "next"
        ? "Preparando el próximo momento"
        : mode === "finished"
          ? "Rutina terminada"
          : "Quedan 10 minutos";

  return (
    <main className="min-h-screen bg-[#f3f3f4] px-5 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-4xl font-black tracking-tight text-slate-800">
              Ahora <span className="text-sky-500">Sigue</span>
            </div>
            <p className="mt-2 max-w-2xl text-slate-500">
              Demo visual alineada a la referencia de arte: una sola tarjeta mobile,
              ilustración protagonista, progresión “Ahora / En breve / Ahora sigue”.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={start}
              className="rounded-2xl bg-sky-500 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-sky-600"
            >
              <Play className="mr-2 inline h-4 w-4" /> Iniciar demo
            </button>
            <button
              onClick={pause}
              className="rounded-2xl bg-white px-4 py-3 font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50"
            >
              <Pause className="mr-2 inline h-4 w-4" /> Pausar
            </button>
            <button
              onClick={nextStep}
              className="rounded-2xl bg-white px-4 py-3 font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50"
            >
              <SkipForward className="mr-2 inline h-4 w-4" /> Siguiente
            </button>
            <button
              onClick={reset}
              className="rounded-2xl bg-white px-4 py-3 font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50"
            >
              <RotateCcw className="mr-2 inline h-4 w-4" /> Reset
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[420px_1fr] lg:items-start">
          <MobileCard
            mode={mode}
            activity={activity}
            progress={mode === "finished" ? 1 : progress}
            countdown={countdown}
          />
          <InfoPanel />
        </div>
      </div>
    </main>
  );
}