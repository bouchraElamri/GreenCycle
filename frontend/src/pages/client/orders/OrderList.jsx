import { Fragment, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiCalendar,
  FiEye,
  FiPackage,
  FiRefreshCcw,
  FiSearch,
} from "react-icons/fi";
import AuthContext from "../../../contexts/AuthContext";
import { getClientOrders } from "../../../api/clientApi";

const PAGE_SIZE = 8;

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "confirmed", label: "Confirmed" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "canceled", label: "Canceled" },
];

function currency(value) {
  const amount = Number(value || 0);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString();
}

function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
}

function getStatusBadgeClass(status) {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "pending") return "bg-amber-100 text-amber-700";
  if (normalized === "confirmed") return "bg-blue-100 text-blue-700";
  if (normalized === "shipped") return "bg-indigo-100 text-indigo-700";
  if (normalized === "delivered") return "bg-green-100 text-green-700";
  if (normalized === "canceled" || normalized === "cancelled")
    return "bg-red-100 text-red-700";
  return "bg-gray-100 text-gray-700";
}

function extractClientId(user) {
  const direct = [
    user?.clientId,
    user?.client?._id,
    user?.clientProfileId,
    user?.profile?.clientId,
  ].find(Boolean);
  if (direct) return String(direct);

  try {
    const stored = JSON.parse(localStorage.getItem("user") || "{}");
    const fallback = [
      stored?.clientId,
      stored?.client?._id,
      stored?.clientProfileId,
      stored?.profile?.clientId,
    ].find(Boolean);
    return fallback ? String(fallback) : "";
  } catch {
    return "";
  }
}

function normalizeOrders(input) {
  if (!Array.isArray(input)) return [];

  return input
    .map((order) => {
      const orderId = order?.orderId || order?._id || "";
      const status = String(order?.status || "pending").toLowerCase();

      const itemsFromOrder = Array.isArray(order?.items)
        ? order.items.map((item) => ({
            name:
              item?.name ||
              item?.product?.name ||
              item?.productName ||
              "Product",
            quantity: Number(item?.quantity || 0),
            price: Number(item?.price ?? item?.product?.price ?? 0),
          }))
        : [];

      const itemFromPendingShape = order?.product
        ? [
            {
              name: order.product.name || "Product",
              quantity: Number(order.quantity || 0),
              price: Number(order.product.price || 0),
            },
          ]
        : [];

      const items = itemsFromOrder.length ? itemsFromOrder : itemFromPendingShape;
      const totalPrice =
        Number(order?.totalPrice) ||
        items.reduce(
          (sum, item) =>
            sum + Number(item.price || 0) * Number(item.quantity || 0),
          0
        );
      const totalQuantity = items.reduce(
        (sum, item) => sum + Number(item.quantity || 0),
        0
      );

      return {
        id: String(orderId),
        reference: String(orderId).slice(-8).toUpperCase(),
        status,
        createdAt: order?.createdAt || order?.orderDate || order?.date || "",
        totalPrice,
        totalQuantity,
        items,
        deliveryAddress: order?.deliveryAddress || null,
      };
    })
    .filter((order) => order.id && order.status !== "pending");
}

function OrdersTableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="grid grid-cols-12 gap-3 rounded-xl border border-green-light/60 bg-white p-4 animate-pulse"
        >
          <div className="col-span-5">
            <div className="h-4 w-40 rounded bg-gray-200" />
            <div className="mt-2 h-3 w-28 rounded bg-gray-100" />
          </div>
          <div className="col-span-2 h-4 w-12 rounded bg-gray-200 self-center" />
          <div className="col-span-2 h-6 w-20 rounded-full bg-gray-100 self-center" />
          <div className="col-span-2 h-4 w-16 rounded bg-gray-200 self-center" />
          <div className="col-span-1 h-8 w-8 rounded-lg bg-gray-100 justify-self-end self-center" />
        </div>
      ))}
    </div>
  );
}

export default function OrderList() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState("");

  async function loadOrders() {
    setError("");

    try {
      const clientId = extractClientId(user);
      if (!clientId) {
        setOrders([]);
        setError(
          "Client profile ID is not available in your session. Please sign out and sign in again."
        );
        return;
      }

      const result = normalizeOrders(await getClientOrders(clientId));
      const unique = Array.from(
        new Map(result.map((order) => [order.id, order])).values()
      );
      unique.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      setOrders(unique);
    } catch (err) {
      setError(err?.message || "Failed to load orders");
      setOrders([]);
    }
  }

  useEffect(() => {
    let mounted = true;

    async function init() {
      setLoading(true);
      try {
        await loadOrders();
      } finally {
        if (mounted) setLoading(false);
      }
    }

    init();
    return () => {
      mounted = false;
    };
  }, [user]);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const statusMatch = status === "all" || order.status === status;
      const dateMatch =
        !dateFilter || String(order.createdAt || "").slice(0, 10) === dateFilter;
      const names = (order.items || [])
        .map((item) => String(item.name || "").toLowerCase())
        .join(" ");
      const textMatch =
        !query ||
        order.id.toLowerCase().includes(query) ||
        order.reference.toLowerCase().includes(query) ||
        names.includes(query);

      return statusMatch && dateMatch && textMatch;
    });
  }, [orders, search, status, dateFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));

  useEffect(() => {
    setPage(1);
  }, [search, status, dateFilter]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const visibleOrders = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredOrders.slice(start, start + PAGE_SIZE);
  }, [filteredOrders, page]);

  const summary = useMemo(
    () => ({
      total: orders.length,
      confirmed: orders.filter((order) => order.status === "confirmed").length,
      delivered: orders.filter((order) => order.status === "delivered").length,
    }),
    [orders]
  );

  async function handleRefresh() {
    setRefreshing(true);
    try {
      await loadOrders();
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <section className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-green-light/60 bg-white-intense p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-gray-500">Total orders</p>
          <p className="mt-2 text-2xl font-bold text-green-dark">{summary.total}</p>
        </div>
        <div className="rounded-2xl border border-green-light/60 bg-white-intense p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-gray-500">Confirmed</p>
          <p className="mt-2 text-2xl font-bold text-blue-600">{summary.confirmed}</p>
        </div>
        <div className="rounded-2xl border border-green-light/60 bg-white-intense p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-gray-500">Delivered</p>
          <p className="mt-2 text-2xl font-bold text-green-600">{summary.delivered}</p>
        </div>
        <div className="rounded-2xl border border-green-light/60 bg-white-intense p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-gray-500">Statuses shown</p>
          <p className="mt-2 text-sm font-semibold text-gray-700">Confirmed, Shipped, Delivered, Canceled</p>
        </div>
      </div>

      <div className="rounded-3xl border border-green-light/70 bg-white-intense shadow-sm">
        <div className="flex flex-col gap-4 border-b border-green-light/60 px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-green-dark">My Orders</h1>
              <p className="mt-1 text-sm text-gray-600">Track your orders and statuses</p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/products")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-dark px-4 py-2.5 text-sm font-semibold text-white-intense hover:opacity-90"
            >
              <FiPackage className="h-4 w-4" />
              Browse Products
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1.3fr)_170px_180px_auto]">
            <label className="flex items-center gap-2 rounded-xl border border-green-light bg-white px-3 py-2">
              <FiSearch className="h-4 w-4 text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by order ID, product, reference..."
                className="w-full bg-transparent text-sm outline-none"
              />
            </label>

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="rounded-xl border border-green-light bg-white px-3 py-2 text-sm outline-none"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <label className="flex items-center gap-2 rounded-xl border border-green-light bg-white px-3 py-2">
              <FiCalendar className="h-4 w-4 text-gray-500" />
              <input
                type="date"
                value={dateFilter}
                onChange={(event) => setDateFilter(event.target.value)}
                className="w-full bg-transparent text-sm outline-none"
              />
            </label>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-green-light bg-white px-3 py-2 text-sm font-medium text-green-dark hover:bg-green-50 disabled:opacity-60"
            >
              <FiRefreshCcw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {error && <div className="mb-4 rounded-xl bg-red-100 px-4 py-3 text-sm text-red-700">{error}</div>}

          {loading ? (
            <OrdersTableSkeleton />
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-green-light/80 bg-green-50/40 px-6 py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                <FiPackage className="h-6 w-6 text-green-dark" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-green-dark">No orders found</h3>
              <p className="mt-1 max-w-md text-sm text-gray-600">
                No orders yet. Browse products and use the cart checkout flow to place your first order.
              </p>
              <button
                type="button"
                onClick={() => navigate("/products")}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-green-dark px-4 py-2.5 text-sm font-semibold text-white-intense"
              >
                <FiPackage className="h-4 w-4" />
                Browse Products
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-2xl border border-green-light/70">
                <table className="min-w-full text-sm">
                  <thead className="bg-green-50/70 text-left text-xs uppercase tracking-wide text-gray-600">
                    <tr>
                      <th className="px-4 py-3">Product / Reference</th>
                      <th className="px-4 py-3">Quantity</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Total Price</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-green-light/50 bg-white">
                    {visibleOrders.map((order) => {
                      const firstName = order.items?.[0]?.name || "Order item";
                      const extraCount = Math.max(0, (order.items?.length || 0) - 1);
                      const expanded = expandedId === order.id;

                      return (
                        <Fragment key={order.id}>
                          <tr className="transition hover:bg-green-50/40">
                            <td className="px-4 py-4 align-top">
                              <p className="font-semibold text-green-dark">
                                {firstName}
                                {extraCount > 0 ? ` +${extraCount} more` : ""}
                              </p>
                              <p className="mt-1 text-xs text-gray-500">
                                Ref: #{order.reference} - {formatDate(order.createdAt)}
                              </p>
                            </td>
                            <td className="px-4 py-4 align-top text-gray-700">{order.totalQuantity}</td>
                            <td className="px-4 py-4 align-top">
                              <span
                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${getStatusBadgeClass(
                                  order.status
                                )}`}
                              >
                                {order.status}
                              </span>
                            </td>
                            <td className="px-4 py-4 align-top font-medium text-gray-800">
                              {currency(order.totalPrice)}
                            </td>
                            <td className="px-4 py-4 align-top">
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setExpandedId((current) => (current === order.id ? "" : order.id))
                                  }
                                  className="inline-flex items-center gap-1 rounded-lg border border-green-light px-3 py-1.5 text-xs font-medium text-green-dark hover:bg-green-50"
                                >
                                  <FiEye className="h-3.5 w-3.5" />
                                  Details
                                </button>

                              </div>
                            </td>
                          </tr>

                          {expanded && (
                            <tr className="bg-green-50/20">
                              <td colSpan={5} className="px-4 py-4">
                                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                  <div className="rounded-xl border border-green-light/60 bg-white p-4">
                                    <h4 className="text-sm font-semibold text-green-dark">Items</h4>
                                    <p className="mt-2 text-xs text-gray-500">
                                      Created: {formatDateTime(order.createdAt)}
                                    </p>
                                    <ul className="mt-3 space-y-2 text-sm text-gray-700">
                                      {(order.items || []).map((item, index) => (
                                        <li
                                          key={`${order.id}-item-${index}`}
                                          className="flex items-center justify-between gap-3"
                                        >
                                          <span className="truncate">{item.name}</span>
                                          <span className="whitespace-nowrap text-xs text-gray-600">
                                            x{item.quantity} - {currency(item.price)}
                                          </span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>

                                  <div className="rounded-xl border border-green-light/60 bg-white p-4">
                                    <h4 className="text-sm font-semibold text-green-dark">Delivery Summary</h4>
                                    {order.deliveryAddress ? (
                                      <p className="mt-2 text-sm text-gray-700">
                                        {order.deliveryAddress.street}, {order.deliveryAddress.city},{" "}
                                        {order.deliveryAddress.zip}, {order.deliveryAddress.country}
                                      </p>
                                    ) : (
                                      <p className="mt-2 text-sm text-gray-500">
                                        Delivery details are not exposed by this endpoint.
                                      </p>
                                    )}
                                    <p className="mt-3 text-xs text-gray-500">
                                      Use this panel to review status and item details.
                                    </p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-600">
                  Showing {filteredOrders.length ? (page - 1) * PAGE_SIZE + 1 : 0}-
                  {Math.min(page * PAGE_SIZE, filteredOrders.length)} of {filteredOrders.length} orders
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={page === 1}
                    className="rounded-lg border border-green-light bg-white px-3 py-2 text-xs font-medium text-green-dark disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-xs text-gray-600">
                    Page {page} / {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={page === totalPages}
                    className="rounded-lg border border-green-light bg-white px-3 py-2 text-xs font-medium text-green-dark disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
