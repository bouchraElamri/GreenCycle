import useSellerDashboard from "../../../hooks/useSellerDashboard";
import SellerDashboardHero from "./components/SellerDashboardHero";
import SellerStatsGrid from "./components/SellerStatsGrid";
import SellerPerformancePanels from "./components/SellerPerformancePanels";
import SellerRecentOrdersSection from "./components/SellerRecentOrdersSection";

export default function SellerDashboard() {
  const { loading, error, sellerProfile, stats, recentOrders } = useSellerDashboard();

  if (loading) {
    return (
      <div className="rounded-2xl bg-white-intense p-8 shadow text-green-dark">
        Loading seller dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && <div className="rounded-xl bg-red-100 text-red-700 p-4">{error}</div>}

      <SellerDashboardHero hasSellerProfile={Boolean(sellerProfile?._id)} />

      <SellerStatsGrid stats={stats} />

      <SellerPerformancePanels stats={stats} />
      <SellerRecentOrdersSection recentOrders={recentOrders} />
    </div>
  );
}
