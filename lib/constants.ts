mport { ActivityTemplate } from "@/types";

export const ACTIVITY_TEMPLATES: ActivityTemplate[] = [
  { id: "play", label: "Jugar", illustration: "play", defaultMinutes: 15 },
  { id: "task", label: "Hacer tarea", illustration: "task", defaultMinutes: 10 },
  { id: "bath", label: "Bañarse", illustration: "bath", defaultMinutes: 8 },
  { id: "dinner", label: "Cenar", illustration: "dinner", defaultMinutes: 20 },
  { id: "sleep", label: "Dormir", illustration: "sleep", defaultMinutes: 5 },
];