export function PageBand({
  kicker,
  title,
  lead,
}: {
  kicker: string;
  title: string;
  lead: string;
}) {
  return (
    <header className="page-band">
      <div className="wrap">
        <div className="eyebrow">{kicker}</div>
        <h1>{title}</h1>
        <p className="lead">{lead}</p>
      </div>
    </header>
  );
}
