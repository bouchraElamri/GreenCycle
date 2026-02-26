import SellerStatCard from "./SellerStatCard";

export default function SellerStatsGrid({ stats }) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <SellerStatCard label="Total Products" value={stats.total} />
      <SellerStatCard label="Approved Products" value={stats.approved} tone="light" />
      <SellerStatCard label="Out of Stock" value={stats.outOfStock} tone="warning" />
    </section>
  );
}
