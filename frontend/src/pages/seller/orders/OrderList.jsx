import { useMemo, useState } from "react";
import useSellerOrders from "../../../hooks/useSellerOrders";
import { RiArrowDownSLine } from "react-icons/ri";

export default function OrderList() {
  const [status, setStatus] = useState("all");
  const { orders, loading, error, missingSellerId } = useSellerOrders();

  const [open, setOpen] = useState(false);
  const statusLabel = useMemo(() => {
    if (status === "all") return "All statuses";
    if (status === "confirmed") return "Confirmed";
    if (status === "delivered") return "Delivered";
    return "All statuses";
  }, [status]);
  const options = [
    { value: "all", label: "All statuses" },
    { value: "confirmed", label: "Confirmed" },
    { value: "delivered", label: "Delivered" },
  ];

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
          <div className="relative w-56">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="w-full rounded-xl border flex justify-between items-center border-green-light bg-white px-3 py-2 text-left"
            >
              {statusLabel}
           <RiArrowDownSLine size={18} />
            </button>

            {open && (
              <div className="absolute z-20 mt-2 w-full rounded-xl border border-green-light bg-white-intense shadow-lg">
                {options.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setStatus(opt.value);
                      setOpen(false);
                    }}
                    className={`block w-full px-3 py-2 text-left hover:bg-green-light/30 ${status === opt.value ? "bg-green-light/40 font-bold text-green-dark" : "text-gray-700"
                      }`}
                  >
                    {opt.label}
                    
                  </button>
                ))}
              </div>
            )}
          </div>

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
                    className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${order.status === "delivered"
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
