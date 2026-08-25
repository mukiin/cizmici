export function daysUntil(month: number, day: number, from = new Date()): number {
  const year =
    from.getMonth() + 1 > month || (from.getMonth() + 1 === month && from.getDate() > day)
      ? from.getFullYear() + 1
      : from.getFullYear();
  const target = new Date(year, month - 1, day);
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  return Math.round((target.getTime() - start.getTime()) / 86_400_000);
}
