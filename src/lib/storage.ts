import { Routine } from "@/types";

const STORAGE_KEY = "ahora-sigue:routines";

export function getRoutines(): Routine[] {
  if (typeof window === "undefined") return [];

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as Routine[];
  } catch {
    return [];
  }
}

export function saveRoutines(routines: Routine[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(routines));
}

export function createRoutine(routine: Routine) {
  const routines = getRoutines();
  saveRoutines([...routines, routine]);
}