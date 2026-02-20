import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import adminApi from "../../../api/adminApi";

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
};

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Missing auth token");

        const data = await adminApi.getOrderDetails(token, id);
        setOrder(data);
      } catch (err) {
        setError(err.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  return (
    <section className="w-full font-nexa">
      <div className="mb-4">
        <Link to="/admin/orders" className="text-green-dark underline-offset-2 hover:underline">
          Back to orders
        </Link>
      </div>

      <h1 className="mb-4 text-4xl font-black text-gray">Order Details</h1>

      {loading && <p className="p-4 text-gray">Loading order details...</p>}
      {error && !loading && <p className="p-4 text-red">{error}</p>}

      {!loading && !error && order && (
        <>
          <div className="mb-5 rounded-2xl border border-white-broken bg-white-intense p-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <p className="text-gray"><strong>Order ID:</strong> {order.orderId}</p>
              <p className="text-gray"><strong>Status:</strong> {order.status || "-"}</p>
              <p className="text-gray"><strong>Total Price:</strong> {order.totalPrice ?? "-"}</p>
              <p className="text-gray"><strong>Date:</strong> {formatDate(order.date)}</p>
              <p className="text-gray"><strong>Client ID:</strong> {String(order.clientId || "-")}</p>
              <p className="text-gray"><strong>Client User ID:</strong> {String(order.clientUserId || "-")}</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white-broken bg-white-intense">
            <table className="w-full min-w-[900px] text-left">
              <thead className="bg-green-light/35 text-gray">
                <tr>
                  <th className="px-4 py-3 text-sm font-bold">Seller ID</th>
                  <th className="px-4 py-3 text-sm font-bold">Seller User ID</th>
                  <th className="px-4 py-3 text-sm font-bold">Product Name</th>
                  <th className="px-4 py-3 text-sm font-bold">Price</th>
                  <th className="px-4 py-3 text-sm font-bold">Quantity</th>
                  <th className="px-4 py-3 text-sm font-bold">Photos</th>
                </tr>
              </thead>
              <tbody>
                {(order.items || []).length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-4 text-gray">
                      No items in this order.
                    </td>
                  </tr>
                ) : (
                  order.items.map((item, index) => (
                    <tr key={`${item.productId || "item"}-${index}`} className="border-t border-white-broken/80">
                      <td className="px-4 py-3 text-gray">{String(item.sellerId || "-")}</td>
                      <td className="px-4 py-3 text-gray">{String(item.sellerUserId || "-")}</td>
                      <td className="px-4 py-3 text-gray">{item.name || "-"}</td>
                      <td className="px-4 py-3 text-gray">{item.price ?? "-"}</td>
                      <td className="px-4 py-3 text-gray">{item.quantity ?? "-"}</td>
                      <td className="px-4 py-3 text-gray">
                        {Array.isArray(item.photos) && item.photos.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {item.photos.map((photo, photoIdx) => (
                              <a
                                key={`${photo}-${photoIdx}`}
                                href={photo}
                                target="_blank"
                                rel="noreferrer"
                                className="text-green-dark underline-offset-2 hover:underline"
                              >
                                Photo {photoIdx + 1}
                              </a>
                            ))}
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
