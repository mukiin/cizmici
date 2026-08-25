import Link from "next/link";
import type { Road } from "@/lib/types";

export function RoadTable({ roads }: { roads: Road[] }) {
  return (
    <table className="road-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Putni pravac</th>
          <th>Dužina</th>
        </tr>
      </thead>
      <tbody>
        {roads.map((r) => (
          <tr key={r.slug}>
            <td>{r.id}</td>
            <td>
              <Link href={`/infrastruktura/${r.slug}`} className="road-link">
                <span>{r.name}</span>
                <span className="tl-open">Podaci →</span>
              </Link>
            </td>
            <td>{r.km}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
