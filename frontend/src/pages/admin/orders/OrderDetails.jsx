import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import adminApi from "../../../api/adminApi";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";
const API_HOST = API_BASE_URL.replace(/\/api$/, "");

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
};

const toAbsoluteUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${API_HOST}${path.startsWith("/") ? path : `/${path}`}`;
};

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);
  const [previewIndex, setPreviewIndex] = useState(0);

  const openPreview = (images, startIndex = 0, alt = "Preview image") => {
    const normalized = (images || []).filter(Boolean);
    if (!normalized.length) return;
    setPreviewImages(normalized);
    setPreviewIndex(startIndex >= 0 ? startIndex : 0);
    setPreviewImage({ alt });
  };

  const closePreview = () => {
    setPreviewImage(null);
    setPreviewImages([]);
    setPreviewIndex(0);
  };

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

      <h1 className="mb-4 text-3xl font-black text-gray sm:text-4xl">Order Details</h1>

      {loading && <p className="p-4 text-gray">Loading order details...</p>}
      {error && !loading && <p className="p-4 text-red">{error}</p>}

      {!loading && !error && order && (
        <>
          <div className="mb-5 rounded-2xl border border-white-broken bg-white-intense p-4 sm:p-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <p className="text-gray"><strong>Order ID:</strong> {order.orderId}</p>
              <p className="text-gray"><strong>Status:</strong> {order.status || "-"}</p>
              <p className="text-gray"><strong>Total Price:</strong> {order.totalPrice ?? "-"}</p>
              <p className="text-gray"><strong>Date:</strong> {formatDate(order.date)}</p>
              <p className="text-gray"><strong>Client Full Name:</strong> {order.clientFullName || "-"}</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white-broken bg-white-intense">
            <table className="w-full min-w-[820px] text-left sm:min-w-[900px]">
              <thead className="bg-green-light/35 text-gray">
                <tr>
                  <th className="px-4 py-3 text-sm font-bold">Seller Name</th>
                  <th className="px-4 py-3 text-sm font-bold">Seller Profile</th>
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
                      <td className="px-4 py-3 text-gray">{item.sellerName || "-"}</td>
                      <td className="px-4 py-3 text-gray">
                        {item.sellerProfileUrl ? (
                          <button
                            type="button"
                            className="block"
                            onClick={() =>
                              openPreview(
                                [toAbsoluteUrl(item.sellerProfileUrl)],
                                0,
                                item.sellerName || "Seller profile"
                              )
                            }
                          >
                            <img
                              src={toAbsoluteUrl(item.sellerProfileUrl)}
                              alt={item.sellerName || "Seller profile"}
                              className="h-10 w-10 rounded-full object-cover border border-white-broken"
                            />
                          </button>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray">{item.name || "-"}</td>
                      <td className="px-4 py-3 text-gray">{item.price ?? "-"}</td>
                      <td className="px-4 py-3 text-gray">{item.quantity ?? "-"}</td>
                      <td className="px-4 py-3 text-gray">
                        {Array.isArray(item.photos) && item.photos.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {item.photos.map((photo, photoIdx) => (
                              <button
                                type="button"
                                key={`${photo}-${photoIdx}`}
                                className="text-green-dark underline-offset-2 hover:underline"
                                onClick={() =>
                                  openPreview(
                                    (item.photos || []).map((p) => toAbsoluteUrl(p)),
                                    photoIdx,
                                    `${item.name || "Product"} photo`
                                  )
                                }
                              >
                                Photo {photoIdx + 1}
                              </button>
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

          {previewImage && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
              onClick={closePreview}
            >
              <div
                className="relative max-h-[90vh] w-full max-w-3xl rounded-2xl bg-white p-3"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  {previewImages.length > 1 && (
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewIndex((prev) =>
                            prev === 0 ? previewImages.length - 1 : prev - 1
                          )
                        }
                        className="rounded-md border border-white-broken bg-white px-3 py-1 text-sm font-semibold text-gray hover:bg-white-broken/40"
                      >
                        Previous
                      </button>
                      <span className="text-sm text-gray">
                        {previewIndex + 1}/{previewImages.length}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewIndex((prev) =>
                            prev === previewImages.length - 1 ? 0 : prev + 1
                          )
                        }
                        className="rounded-md border border-white-broken bg-white px-3 py-1 text-sm font-semibold text-gray hover:bg-white-broken/40"
                      >
                        Next
                      </button>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={closePreview}
                    className="rounded-md border border-white-broken px-3 py-1 text-sm text-white hover:bg-white-broken/40"
                    style={{ color: "#ffffff" }}
                  >
                    Close
                  </button>
                </div>
                <img
                  src={previewImages[previewIndex]}
                  alt={previewImage.alt}
                  className="max-h-[78vh] w-full rounded-xl object-contain"
                />
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
