import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import sellerApi from "../../../api/sellerApi";

function StatCard({ label, value, tone = "dark" }) {
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

export default function SellerDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [sellerProfile, setSellerProfile] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      setLoading(true);
      setError("");

      try {
        const [productsData, profileData] = await Promise.all([
          sellerApi.getProducts(),
          sellerApi.getSellerProfile().catch(() => null),
        ]);

        const profile = profileData?.data || profileData || null;
        const sellerId =
          profile?._id ||
          localStorage.getItem("sellerId") ||
          JSON.parse(localStorage.getItem("user") || "{}")?.sellerId ||
          "";

        const scopedProducts = sellerId
          ? (productsData || []).filter((item) => String(item.seller) === String(sellerId))
          : productsData || [];

        let ordersData = [];
        if (sellerId) {
          ordersData = await sellerApi.getSellerOrders(sellerId).catch(() => []);
        }

        if (!mounted) return;
        setSellerProfile(profile);
        setProducts(scopedProducts);
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      } catch (err) {
        if (!mounted) return;
        setError(err?.message || "Failed to load dashboard");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadDashboard();
    return () => {
      mounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const total = products.length;
    const lowStock = products.filter((p) => Number(p.quantity) > 0 && Number(p.quantity) < 5).length;
    const outOfStock = products.filter((p) => Number(p.quantity) === 0).length;
    const approved = products.filter((p) => Boolean(p.isApproved)).length;
    const pendingApproval = products.filter((p) => !p.isApproved).length;
    const totalOrders = orders.length;
    const deliveredOrders = orders.filter((o) => o.status === "delivered").length;

    return {
      total,
      lowStock,
      outOfStock,
      approved,
      pendingApproval,
      totalOrders,
      deliveredOrders,
    };
  }, [products, orders]);

  const recentOrders = useMemo(() => orders.slice(0, 5), [orders]);

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

      <section className="rounded-3xl p-5 sm:p-7 bg-gradient-to-r from-green-tolerated to-green-dark text-white-intense shadow">
        <h2 className="text-2xl sm:text-3xl font-bold">Seller Dashboard</h2>
        <p className="mt-2 text-sm sm:text-base text-white-broken">
          {sellerProfile?._id
            ? "Your seller data is connected to live endpoints."
            : "Seller profile endpoint is missing; showing available data only."}
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Products" value={stats.total} />
        <StatCard label="Approved Products" value={stats.approved} tone="light" />
        <StatCard label="Pending Approval" value={stats.pendingApproval} />
        <StatCard label="Out of Stock" value={stats.outOfStock} tone="warning" />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <article className="rounded-2xl bg-white-intense p-5 shadow">
          <h3 className="text-xl font-bold text-green-dark">Inventory Snapshot</h3>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Low stock (1-4 units)</span>
              <span className="font-bold text-green-dark">{stats.lowStock}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Out of stock</span>
              <span className="font-bold text-red-700">{stats.outOfStock}</span>
            </div>
            <div className="h-2 rounded-full bg-green-light overflow-hidden">
              <div
                className="h-full bg-green-dark"
                style={{
                  width: `${stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%`,
                }}
              />
            </div>
            <p className="text-xs text-gray-600">Approval rate based on current product list.</p>
          </div>
        </article>

        <article className="rounded-2xl bg-white-intense p-5 shadow">
          <h3 className="text-xl font-bold text-green-dark">Order Status</h3>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">All orders</span>
              <span className="font-bold text-green-dark">{stats.totalOrders}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Delivered</span>
              <span className="font-bold text-green-dark">{stats.deliveredOrders}</span>
            </div>
            <div className="h-2 rounded-full bg-green-light overflow-hidden">
              <div
                className="h-full bg-green-medium"
                style={{
                  width: `${stats.totalOrders > 0 ? Math.round((stats.deliveredOrders / stats.totalOrders) * 100) : 0}%`,
                }}
              />
            </div>
            <p className="text-xs text-gray-600">Delivery completion progress.</p>
          </div>
        </article>
      </section>

      <section className="rounded-2xl bg-white-intense p-5 shadow">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-green-dark">Recent Orders</h3>
          <Link to="/seller/orders" className="text-sm font-bold text-green-medium">
            View all
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="mt-4 text-gray-600">No seller orders found yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left min-w-[640px]">
              <thead>
                <tr className="text-sm text-gray-600 border-b">
                  <th className="py-2">Order</th>
                  <th className="py-2">Client</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.orderId} className="border-b last:border-0">
                    <td className="py-3 font-bold text-green-dark">#{String(order.orderId).slice(-6)}</td>
                    <td className="py-3">
                      {order.client?.firstName} {order.client?.lastName}
                    </td>
                    <td className="py-3 capitalize">{order.status || "confirmed"}</td>
                    <td className="py-3">
                      {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
