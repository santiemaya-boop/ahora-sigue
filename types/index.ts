export type Mode = "now" | "soon" | "next" | "finished";

export type TimeOfDay = "morning" | "afternoon" | "night";

export type IllustrationKey =
  | "play"
  | "task"
  | "bath"
  | "dinner"
  | "sleep"
  | "soon"
  | "finished";

export type ActivityTemplate = {
  id: string;
  label: string;
  illustration: IllustrationKey;
  defaultMinutes: number;
};

export type RoutineActivity = {
  id: string;
  templateId: string;
  label: string;
  illustration: IllustrationKey;
  minutes: number;
  order: number;
};

export type Routine = {
  id: string;
  name: string;
  timeOfDay: TimeOfDay;
  activities: RoutineActivity[];
  createdAt: string;
  updatedAt: string;
};