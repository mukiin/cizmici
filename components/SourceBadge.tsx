import type { SourceKind } from "@/lib/types";

const labels: Record<SourceKind, string> = {
  official: "službeni akt",
  verified: "zvanična statistika",
  public: "javni izvor",
};

export function SourceBadge({ kind, label }: { kind: SourceKind; label?: string }) {
  return (
    <span className={`badge ${kind}`}>
      <i className="d" />
      {label ?? labels[kind]}
    </span>
  );
}
