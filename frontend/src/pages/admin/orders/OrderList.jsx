import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import adminApi from "../../../api/adminApi";

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString();
};

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Missing auth token");

        const data = await adminApi.getOrders(token, statusFilter);
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [statusFilter]);

  const filterBtnClass = (value) =>
    `rounded-full px-4 py-2 text-sm font-bold transition ${
      statusFilter === value
        ? "bg-green-dark text-white-intense"
        : "border border-green-tolerated text-green-dark hover:bg-green-light/35"
    }`;

  return (
    <section className="w-full font-nexa">
      <h1 className="mb-6 text-5xl font-black text-gray">Orders</h1>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button type="button" className={filterBtnClass("all")} onClick={() => setStatusFilter("all")}>
          All
        </button>
        <button
          type="button"
          className={filterBtnClass("confirmed")}
          onClick={() => setStatusFilter("confirmed")}
        >
          Confirmed
        </button>
        <button
          type="button"
          className={filterBtnClass("delivered")}
          onClick={() => setStatusFilter("delivered")}
        >
          Delivered
        </button>
      </div>

      {loading && <p className="p-4 text-gray">Loading orders...</p>}
      {error && !loading && <p className="p-4 text-red">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto rounded-2xl border border-white-broken bg-white-intense">
          <table className="w-full min-w-[780px] text-left">
            <thead className="bg-green-light/35 text-gray">
              <tr>
                <th className="px-4 py-3 text-sm font-bold">Order ID</th>
                <th className="px-4 py-3 text-sm font-bold">Price</th>
                <th className="px-4 py-3 text-sm font-bold">Client Name</th>
                <th className="px-4 py-3 text-sm font-bold">Date</th>
                <th className="px-4 py-3 text-sm font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-4 text-gray">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.orderId} className="border-t border-white-broken/80">
                    <td className="px-4 py-3 text-gray">
                      <Link
                        to={`/admin/orders/${order.orderId}`}
                        className="inline-block max-w-[220px] truncate font-bold text-green-dark underline-offset-2 hover:underline"
                        title={order.orderId}
                      >
                        {order.orderId}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray">{order.totalPrice ?? "-"}</td>
                    <td className="px-4 py-3 text-gray">{order.clientFullName || "-"}</td>
                    <td className="px-4 py-3 text-gray">{formatDate(order.date)}</td>
                    <td className="px-4 py-3 text-gray">{order.status || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
