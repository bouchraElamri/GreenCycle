import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import adminApi from "../../../api/adminApi";
import OrderDetailsHeader from "./components/OrderDetailsHeader";
import OrderSummaryCard from "./components/OrderSummaryCard";
import OrderItemsTable from "./components/OrderItemsTable";
import OrderImagePreviewModal from "./components/OrderImagePreviewModal";

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
      <OrderDetailsHeader />

      {loading && <p className="p-4 text-gray">Loading order details...</p>}
      {error && !loading && <p className="p-4 text-red">{error}</p>}

      {!loading && !error && order && (
        <>
          <OrderSummaryCard order={order} formatDate={formatDate} />
          <OrderItemsTable
            items={order.items}
            openPreview={openPreview}
            toAbsoluteUrl={toAbsoluteUrl}
          />
          <OrderImagePreviewModal
            previewImage={previewImage}
            previewImages={previewImages}
            previewIndex={previewIndex}
            setPreviewIndex={setPreviewIndex}
            closePreview={closePreview}
          />
        </>
      )}
    </section>
  );
}
