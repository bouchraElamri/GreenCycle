import { useEffect, useMemo, useState } from "react";
import sellerApi from "../api/sellerApi";

export default function useSellerDashboard() {
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
          sellerApi.getSellerProducts(),
          sellerApi.getSellerProfile().catch(() => null),
        ]);

        const profile = profileData?.data || profileData || null;
        const sellerId =
          profile?._id ||
          localStorage.getItem("sellerId") ||
          JSON.parse(localStorage.getItem("user") || "{}")?.sellerId ||
          "";

        const scopedProducts = Array.isArray(productsData) ? productsData : [];

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

  const recentOrders = useMemo(
    () => orders.filter((o) => o.status !== "pending").slice(0, 5),
    [orders]
  );

  return {
    loading,
    error,
    sellerProfile,
    stats,
    recentOrders,
  };
}
