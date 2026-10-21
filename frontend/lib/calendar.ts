export type TonalpohualliDate = {
  number: number;
  sign: string;
  english: string;
};

export type CalendarDate = {
  date: string;
  correlation: string;
  tonalpohualli: TonalpohualliDate;
  day_sign: { name: string; english: string; position: number };
  trecena: { number: number; sign: string; english: string };
  xiuhpohualli: {
    veintena: string;
    day: number;
    position: number;
    reference: VeintenaReference;
  };
  xihuitl: { number: number; sign: string };
};

export type VeintenaReference = {
  position: number;
  name: string;
  span: string;
  span_es: string;
  meaning_es: string;
  meaning_en: string;
  correlation: string;
  source: string;
};

export const NAHUATL_NUMBERS: Record<number, string> = {
  1: "Ce",
  2: "Ome",
  3: "Yei",
  4: "Nahui",
  5: "Macuilli",
  6: "Chicuace",
  7: "Chicome",
  8: "Chicuei",
  9: "Chiucnahui",
  10: "Matlactli",
  11: "Matlactli once",
  12: "Matlactli omome",
  13: "Matlactli omei",
};

export function localDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isValidCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00`);
  return !Number.isNaN(date.getTime()) && localDateString(date) === value;
}

export function formatDisplayDate(dateString: string): {
  month: string;
  day: string;
  year: string;
} {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return {
    month: date.toLocaleString("en-US", { month: "long" }),
    day: String(day),
    year: String(year),
  };
}

export async function getCalendarDate(
  date: string,
  signal: AbortSignal,
): Promise<CalendarDate> {
  const response = await fetch(`/api/calendar/${date}`, {
    cache: "no-store",
    signal,
  });
  if (!response.ok) {
    throw new Error(`The calendar service returned ${response.status}.`);
  }
  return response.json() as Promise<CalendarDate>;
}
