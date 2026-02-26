import { useEffect, useState } from "react";
import adminApi from "../api/adminApi";

export default function useAdminOrders() {
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

  return {
    orders,
    statusFilter,
    setStatusFilter,
    loading,
    error,
  };
}
