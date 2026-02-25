import { useEffect, useMemo, useState } from "react";
import sellerApi from "../../../api/sellerApi";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [missingSellerId, setMissingSellerId] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadOrders() {
      setLoading(true);
      setError("");
      setMissingSellerId(false);

      try {
        const profileData = await sellerApi.getSellerProfile().catch(() => null);
        const profile = profileData?.data || profileData || null;
        const sellerId =
          profile?._id ||
          localStorage.getItem("sellerId") ||
          JSON.parse(localStorage.getItem("user") || "{}")?.sellerId ||
          "";

        if (!sellerId) {
          if (mounted) {
            setMissingSellerId(true);
            setOrders([]);
          }
          return;
        }

        const data = await sellerApi.getSellerOrders(sellerId);
        const safeOrders = Array.isArray(data) ? data : [];
        if (mounted) {
          setOrders(
            safeOrders.filter(
              (order) => String(order?.status || "").toLowerCase() !== "pending"
            )
          );
        }
      } catch (err) {
        if (mounted) setError(err?.message || "Failed to load orders");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadOrders();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredOrders = useMemo(() => {
    if (status === "all") return orders;
    return orders.filter((order) => String(order.status).toLowerCase() === status);
  }, [orders, status]);

  const summary = useMemo(
    () => ({
      total: orders.length,
      confirmed: orders.filter((order) => order.status === "confirmed").length,
      delivered: orders.filter((order) => order.status === "delivered").length,
    }),
    [orders]
  );

  return (
    <section className="space-y-4">
      <div className="rounded-2xl bg-white-intense p-5 shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-2xl font-bold text-green-dark">Orders</h2>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded-xl border border-green-light px-3 py-2 bg-white"
          >
            <option value="all">All statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl bg-green-light p-4">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold text-green-dark">{summary.total}</p>
          </div>
          <div className="rounded-xl bg-white-broken p-4">
            <p className="text-sm text-gray-600">Confirmed</p>
            <p className="text-2xl font-bold text-green-dark">{summary.confirmed}</p>
          </div>
          <div className="rounded-xl bg-green-100 p-4">
            <p className="text-sm text-gray-600">Delivered</p>
            <p className="text-2xl font-bold text-green-dark">{summary.delivered}</p>
          </div>
        </div>

        {loading && <p className="mt-6 text-gray-600">Loading orders...</p>}
        {error && <div className="mt-6 rounded-lg bg-red-100 text-red-700 p-3">{error}</div>}
        {missingSellerId && (
          <div className="mt-6 rounded-lg bg-red-100 text-red-700 p-3">
            Seller profile ID is missing. Store `sellerId` in localStorage or expose `/api/seller/profile`.
          </div>
        )}

        {!loading && !error && !missingSellerId && filteredOrders.length === 0 && (
          <p className="mt-6 text-gray-600">No orders found.</p>
        )}

        {!loading && filteredOrders.length > 0 && (
          <div className="mt-6 space-y-3">
            {filteredOrders.map((order) => (
              <article key={order.orderId} className="rounded-xl border border-green-light p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <h3 className="font-bold text-green-dark">Order #{String(order.orderId).slice(-6)}</h3>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
                      order.status === "delivered"
                        ? "bg-green-100 text-green-700"
                        : "bg-white-broken text-gray-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <p className="mt-2 text-sm text-gray-600">
                  Client: {order.client?.firstName} {order.client?.lastName} | {order.client?.email}
                </p>
                <p className="text-sm text-gray-600">
                  Phone: {order.client?.phone || "-"} | Date:{" "}
                  {order.orderDate ? new Date(order.orderDate).toLocaleString() : "-"}
                </p>

                <div className="mt-3">
                  <p className="text-sm font-bold text-green-dark">Items</p>
                  <ul className="mt-1 text-sm text-gray-700 space-y-1">
                    {(order.items || []).map((item, index) => (
                      <li key={`${order.orderId}-${index}`}>
                        {item.productName} x{item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
