import { useEffect, useState } from "react";
import sellerApi from "../api/sellerApi";

export default function useSellerOrders() {
  const [orders, setOrders] = useState([]);
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

  return {
    orders,
    loading,
    error,
    missingSellerId,
  };
}
