export default function SellerStatCard({ label, value, tone = "dark" }) {
  const toneClass =
    tone === "light"
      ? "bg-green-light text-green-dark"
      : tone === "warning"
      ? "bg-red-100 text-red-700"
      : "bg-white-intense text-green-dark";

  return (
    <article className={`rounded-2xl p-4 shadow ${toneClass}`}>
      <p className="text-sm">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </article>
  );
}
