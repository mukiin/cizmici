import type { ReactNode } from "react";

export function MockNote({ children }: { children: ReactNode }) {
  return (
    <div className="soon-note">
      <span className="mockbadge">uskoro / pregled izgleda</span>
      <div>{children}</div>
    </div>
  );
}
