// PRODUCTION-READY VERSION (uses /public/illustrations)

"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Play, Pause, SkipForward, RotateCcw } from "lucide-react";

// TYPES

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

// DATA

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

const THEMES: Record<ThemeKey, any> = {
  green: { header: "text-sky-400", progressBg: "bg-sky-100", progressFill: "from-green-300 to-emerald-400", bottom: "bg-sky-100", text: "text-sky-600", accent: "text-sky-600", glow: "", illustrationBg: "from-cyan-50 via-white to-sky-50" },
  violet: { header: "text-slate-400", progressBg: "bg-amber-100", progressFill: "from-violet-300 to-fuchsia-400", bottom: "bg-pink-100", text: "text-violet-700", accent: "text-violet-700", glow: "", illustrationBg: "from-amber-50 via-white to-pink-50" },
  blue: { header: "text-sky-500", progressBg: "bg-sky-100", progressFill: "from-sky-400 to-cyan-400", bottom: "bg-sky-100", text: "text-violet-700", accent: "text-violet-700", glow: "", illustrationBg: "from-sky-50 via-white to-indigo-50" },
  amber: { header: "text-amber-400", progressBg: "bg-amber-100", progressFill: "from-amber-300 to-orange-400", bottom: "bg-orange-100", text: "text-amber-700", accent: "text-amber-700", glow: "", illustrationBg: "from-orange-50 via-white to-amber-50" },
  indigo: { header: "text-indigo-400", progressBg: "bg-indigo-100", progressFill: "from-indigo-300 to-violet-400", bottom: "bg-indigo-100", text: "text-indigo-700", accent: "text-indigo-700", glow: "", illustrationBg: "from-indigo-50 via-white to-violet-50" },
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
      lower: "Terminamos la rutina",
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

function Illustration({ kind }: { kind: IllustrationKey }) {
  return (
    <img
      src={ILLUSTRATION_SRC[kind]}
      className="max-h-[260px] mx-auto"
      alt="illustration"
    />
  );
}

export default function App() {
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<Mode>("now");
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);

  const activity = ACTIVITIES[index];
  const progress = elapsed / 12;

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1;

        if (next === 8) setMode("soon");

        if (next >= 12) {
          const isLast = index === ACTIVITIES.length - 1;

          if (isLast) {
            setMode("finished");
            setRunning(false);
            return 12;
          }

          setMode("next");
          setTimeout(() => {
            setIndex((i) => i + 1);
            setElapsed(0);
            setMode("now");
          }, 1200);
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [running, index]);

  const theme = getTheme(mode, activity);
  const copy = getCardCopy(mode, activity);

  return (
    <div className="p-10">
      <div className="max-w-sm mx-auto bg-white rounded-3xl p-6">
        <h1 className={theme.header}>{copy.header}</h1>
        <Illustration kind={copy.illustration} />
        <h2 className="text-xl whitespace-pre-line">{copy.title}</h2>
        <div className="h-4 bg-gray-200 rounded-full mt-4">
          <div
            className="h-4 bg-blue-400 rounded-full"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <p className="mt-4">{copy.lower}</p>

        <div className="flex gap-2 mt-6">
          <button onClick={() => setRunning(true)}>Start</button>
          <button onClick={() => setRunning(false)}>Pause</button>
          <button onClick={() => setIndex((i) => i + 1)}>Next</button>
          <button onClick={() => window.location.reload()}>Reset</button>
        </div>
      </div>
    </div>
  );
}
