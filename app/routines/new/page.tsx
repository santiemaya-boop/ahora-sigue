"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ACTIVITY_TEMPLATES } from "@/lib/constants";
import { createRoutine } from "@/lib/storage";
import { createId } from "@/lib/ids";
import { RoutineActivity } from "@/types";

export default function NewRoutinePage() {
  const router = useRouter();

  const [name, setName] = useState("Rutina de tarde");
  const [activities, setActivities] = useState<RoutineActivity[]>([]);

  function addActivity(templateId: string) {
    const template = ACTIVITY_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;

    const newActivity: RoutineActivity = {
      id: createId("act"),
      templateId: template.id,
      label: template.label,
      illustration: template.illustration,
      minutes: template.defaultMinutes,
      order: activities.length,
    };

    setActivities([...activities, newActivity]);
  }

  function save() {
    if (activities.length === 0) return;

    const routine = {
      id: createId("routine"),
      name,
      timeOfDay: "afternoon",
      activities,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    createRoutine(routine);
    router.push("/");
  }

  return (
    <main className="min-h-screen bg-[#f3f3f4] px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-black">Nueva rutina</h1>

        <input
          className="mt-6 w-full rounded-xl p-4 border"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="mt-6">
          <h2 className="font-bold">Agregar actividad</h2>

          <div className="flex gap-2 flex-wrap mt-3">
            {ACTIVITY_TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => addActivity(t.id)}
                className="rounded-lg bg-white px-3 py-2 shadow"
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h2 className="font-bold">Actividades</h2>

          {activities.map((a) => (
            <div key={a.id} className="bg-white p-3 rounded-lg mt-2">
              {a.label} — {a.minutes} min
            </div>
          ))}
        </div>

        <button
          onClick={save}
          className="mt-8 rounded-xl bg-sky-500 px-4 py-3 text-white font-semibold"
        >
          Guardar rutina
        </button>
      </div>
    </main>
  );
}