import type { AgeGroup } from "@/lib/types";

export function AgeBars({ groups }: { groups: AgeGroup[] }) {
  const max = Math.max(...groups.map((g) => g.value));
  return (
    <div>
      {groups.map((g) => (
        <div className="bar-row" key={g.label}>
          <div className="mono">{g.label}</div>
          <div className="track">
            <div className="fill" style={{ width: `${((g.value / max) * 100).toFixed(0)}%` }} />
          </div>
          <div className="val">{g.value}</div>
        </div>
      ))}
    </div>
  );
}
