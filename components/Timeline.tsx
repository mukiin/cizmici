import Link from "next/link";
import { SourceBadge } from "@/components/SourceBadge";
import type { TimelineItem } from "@/lib/types";

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <div className="timeline">
      {items.map((item) => (
        <article className="tl-item" key={item.slug}>
          <Link href={`/historija/${item.slug}`} className="tl-link">
            <div className="tl-year">{item.year}</div>
            <h3>{item.title}</h3>
            <p>
              {item.body} <SourceBadge kind={item.source} />
            </p>
            <span className="tl-open">Otvori priču →</span>
          </Link>
        </article>
      ))}
    </div>
  );
}
