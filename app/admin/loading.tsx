export default function AdminLoading() {
  return (
    <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
      <p className="kicker">Administracija</p>
      <div
        style={{
          height: 28,
          width: 180,
          marginBottom: 16,
          borderRadius: 4,
          background: "rgba(33,29,22,0.08)",
        }}
      />
      <div
        style={{
          height: 120,
          borderRadius: 8,
          background: "rgba(33,29,22,0.05)",
          border: "1px solid rgba(33,29,22,0.08)",
        }}
      />
    </div>
  );
}
