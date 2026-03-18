"use client";

import { useEffect, useState } from "react";
import { getRoutines } from "@/lib/storage";
import { Routine } from "@/types";
import Link from "next/link";

export default function HomePage() {
  const [routines, setRoutines] = useState<Routine[]>([]);

  useEffect(() => {
    setRoutines(getRoutines());
  }, []);

  return (
    <main className="min-h-screen bg-[#f3f3f4] px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-black text-slate-800">
          Ahora <span className="text-sky-500">Sigue</span>
        </h1>

        <div className="mt-8">
          {routines.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 shadow">
              <p className="text-slate-600">
                Todavía no creaste ninguna rutina.
              </p>

              <Link
                href="/routines/new"
                className="mt-4 inline-block rounded-xl bg-sky-500 px-4 py-3 text-white font-semibold"
              >
                Crear primera rutina
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {routines.map((routine) => (
                <div
                  key={routine.id}
                  className="rounded-2xl bg-white p-6 shadow flex justify-between items-center"
                >
                  <div>
                    <div className="text-xl font-bold">
                      {routine.name}
                    </div>
                    <div className="text-sm text-slate-500">
                      {routine.activities.length} actividades
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={/run/${routine.id}}
                      className="rounded-lg bg-green-500 px-3 py-2 text-white text-sm"
                    >
                      Iniciar
                    </Link>

                    <Link
                      href={/routines/${routine.id}/edit}
                      className="rounded-lg bg-slate-200 px-3 py-2 text-sm"
                    >
                      Editar
                    </Link>
                  </div>
                </div>
              ))}

              <Link
                href="/routines/new"
                className="inline-block rounded-xl bg-sky-500 px-4 py-3 text-white font-semibold"
              >
                Nueva rutina
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}