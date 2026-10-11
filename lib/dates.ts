const sarajevo = { timeZone: "Europe/Sarajevo" } as const;

function toDate(value: Date | string | number | null | undefined): Date | null {
  if (value == null) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value: Date | string | number | null | undefined): string {
  const date = toDate(value);
  if (!date) return "";
  return date.toLocaleDateString("bs-BA", sarajevo);
}

export function formatDateTime(value: Date | string | number | null | undefined): string {
  const date = toDate(value);
  if (!date) return "";
  return date.toLocaleString("bs-BA", {
    ...sarajevo,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function daysUntil(month: number, day: number, from = new Date()): number {
  const year =
    from.getMonth() + 1 > month || (from.getMonth() + 1 === month && from.getDate() > day)
      ? from.getFullYear() + 1
      : from.getFullYear();
  const target = new Date(year, month - 1, day);
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  return Math.round((target.getTime() - start.getTime()) / 86_400_000);
}
