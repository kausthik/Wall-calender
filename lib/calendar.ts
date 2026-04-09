export interface Note {
  id: string;
  date?: string;
  text: string;
  color: NoteColor;
  createdAt: string;
}

export type NoteColor = "blue" | "rose" | "amber" | "teal" | "violet";

export interface CalendarTheme {
  id: string;
  name: string;
  accent: string;
  imageUrl: string;
  imageAlt: string;
  textColor: string;
}

export interface DayInfo {
  date: Date;
  dateStr: string; // YYYY-MM-DD
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  isSunday: boolean;
  holiday?: string;
}

// ─── Date Helpers ─────────────────────────────────────────────────────────────

export function toDateStr(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function parseDate(str: string): Date {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isBetween(date: Date, start: Date, end: Date): boolean {
  const d = date.getTime();
  const s = Math.min(start.getTime(), end.getTime());
  const e = Math.max(start.getTime(), end.getTime());
  return d > s && d < e;
}

export function isAfter(a: Date, b: Date): boolean {
  return a.getTime() > b.getTime();
}

export function addMonths(date: Date, n: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + n);
  d.setDate(1);
  return d;
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfWeek(year: number, month: number): number {
  // 0 = Mon, 6 = Sun
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

export function buildCalendarGrid(year: number, month: number): DayInfo[] {
  const today = new Date();
  const todayStr = toDateStr(today);
  const firstWeekday = getFirstDayOfWeek(year, month);
  const daysInMonth = getDaysInMonth(year, month);
  const daysInPrevMonth = getDaysInMonth(year, month - 1);

  const cells: DayInfo[] = [];

  // Prev month padding
  for (let i = firstWeekday - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const date = new Date(year, month - 1, day);
    cells.push({
      date,
      dateStr: toDateStr(date),
      day,
      isCurrentMonth: false,
      isToday: toDateStr(date) === todayStr,
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
      isSunday: date.getDay() === 0,
    });
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const dateStr = toDateStr(date);
    cells.push({
      date,
      dateStr,
      day: d,
      isCurrentMonth: true,
      isToday: dateStr === todayStr,
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
      isSunday: date.getDay() === 0,
      holiday: HOLIDAYS[dateStr],
    });
  }

  // Next month padding to fill 6 rows
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    const date = new Date(year, month + 1, d);
    cells.push({
      date,
      dateStr: toDateStr(date),
      day: d,
      isCurrentMonth: false,
      isToday: false,
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
      isSunday: date.getDay() === 0,
    });
  }

  return cells;
}

// ─── Holidays (US + major international) ─────────────────────────────────────

const currentYear = new Date().getFullYear();
export const HOLIDAYS: Record<string, string> = {
  [`${currentYear}-01-01`]: "New Year's Day",
  [`${currentYear}-02-14`]: "Valentine's Day",
  [`${currentYear}-03-08`]: "International Women's Day",
  [`${currentYear}-03-17`]: "St. Patrick's Day",
  [`${currentYear}-04-01`]: "April Fools'",
  [`${currentYear}-04-22`]: "Earth Day",
  [`${currentYear}-05-01`]: "International Workers' Day",
  [`${currentYear}-06-19`]: "Juneteenth",
  [`${currentYear}-07-04`]: "Independence Day",
  [`${currentYear}-08-15`]: "Assumption Day",
  [`${currentYear}-09-01`]: "Labor Day",
  [`${currentYear}-10-31`]: "Halloween",
  [`${currentYear}-11-11`]: "Veterans Day",
  [`${currentYear}-11-27`]: "Thanksgiving",
  [`${currentYear}-12-24`]: "Christmas Eve",
  [`${currentYear}-12-25`]: "Christmas",
  [`${currentYear}-12-31`]: "New Year's Eve",
};

// ─── Themes ───────────────────────────────────────────────────────────────────

export const THEMES: CalendarTheme[] = [
  {
    id: "alpine",
    name: "Alpine",
    accent: "#2478e7",
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&auto=format&fit=crop",
    imageAlt: "Dramatic mountain peaks with misty atmosphere",
    textColor: "#ffffff",
  },
  {
    id: "ocean",
    name: "Ocean",
    accent: "#0891b2",
    imageUrl: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=900&auto=format&fit=crop",
    imageAlt: "Aerial view of crystal clear ocean waters",
    textColor: "#ffffff",
  },
  {
    id: "forest",
    name: "Forest",
    accent: "#16a34a",
    imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=900&auto=format&fit=crop",
    imageAlt: "Sunlight filtering through tall forest trees",
    textColor: "#ffffff",
  },
  {
    id: "desert",
    name: "Desert",
    accent: "#d97706",
    imageUrl: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=900&auto=format&fit=crop",
    imageAlt: "Golden sand dunes at sunset",
    textColor: "#ffffff",
  },
  {
    id: "city",
    name: "City",
    accent: "#7c3aed",
    imageUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=900&auto=format&fit=crop",
    imageAlt: "City skyline at night with lights",
    textColor: "#ffffff",
  },
  {
    id: "sakura",
    name: "Sakura",
    accent: "#db2777",
    imageUrl: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=900&auto=format&fit=crop",
    imageAlt: "Cherry blossom trees in full bloom",
    textColor: "#ffffff",
  },
];


export function getMonthThemeImage(monthIndex: number): string {
  const images = [
    "https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=900&auto=format&fit=crop", // Jan – snow
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&auto=format&fit=crop", // Feb – love
    "https://images.unsplash.com/photo-1490750967868-88df5691cc15?w=900&auto=format&fit=crop", // Mar – spring
    "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=900&auto=format&fit=crop", // Apr – sakura
    "https://images.unsplash.com/photo-1448375240586-882707db888b?w=900&auto=format&fit=crop", // May – forest
    "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=900&auto=format&fit=crop", // Jun – ocean
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop", // Jul – beach
    "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=900&auto=format&fit=crop", // Aug – sunny
    "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=900&auto=format&fit=crop", // Sep – autumn
    "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=900&auto=format&fit=crop", // Oct – desert
    "https://images.unsplash.com/photo-1458668383970-8ddd3927deed?w=900&auto=format&fit=crop", // Nov – mountains
    "https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=900&auto=format&fit=crop", // Dec – winter
  ];
  return images[monthIndex % 12];
}



export function loadNotes(): Note[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("wall-calendar-notes");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveNotes(notes: Note[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("wall-calendar-notes", JSON.stringify(notes));
}

export function loadSettings(): {
  themeId: string;
  view: "month" | "week";
} {
  if (typeof window === "undefined") return { themeId: "alpine", view: "month" };
  try {
    const raw = localStorage.getItem("wall-calendar-settings");
    return raw ? JSON.parse(raw) : { themeId: "alpine", view: "month" };
  } catch {
    return { themeId: "alpine", view: "month" };
  }
}

export function saveSettings(s: { themeId: string; view: "month" | "week" }): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("wall-calendar-settings", JSON.stringify(s));
}



export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const DAY_NAMES_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const DAY_NAMES_LETTER = ["M", "T", "W", "T", "F", "S", "S"];

export const NOTE_COLORS: Record<NoteColor, { bg: string; text: string; border: string; dot: string }> = {
  blue:   { bg: "#eff8ff", text: "#1c61d4", border: "#bfe2fd", dot: "#2478e7" },
  rose:   { bg: "#fff1f3", text: "#9f1239", border: "#fecdd3", dot: "#ff375a" },
  amber:  { bg: "#fffbeb", text: "#92400e", border: "#fde68a", dot: "#d97706" },
  teal:   { bg: "#f0fdfa", text: "#134e4a", border: "#99f6e4", dot: "#0d9488" },
  violet: { bg: "#f5f3ff", text: "#4c1d95", border: "#ddd6fe", dot: "#7c3aed" },
};

export function formatDateRange(start: Date | null, end: Date | null): string {
  if (!start) return "No dates selected";
  if (!end || isSameDay(start, end)) {
    return start.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  }
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  if (sameMonth) {
    return `${start.toLocaleDateString("en-US", { month: "long", day: "numeric" })}–${end.getDate()}, ${end.getFullYear()}`;
  }
  return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
}

export function getDaysBetween(start: Date, end: Date): number {
  const ms = Math.abs(end.getTime() - start.getTime());
  return Math.round(ms / 86400000) + 1;
}
