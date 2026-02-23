import { useEffect, useState } from "react";
import adminApi from "../api/adminApi";

export default function useDashboard() {
  const [data, setData] = useState({
    usersRegistered: 0,
    productsInSelling: 0,
    productsOnHold: 0,
    totalOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("Missing auth token");
        }
        const stats = await adminApi.getDashboard(token);
        setData((prev) => ({
          ...prev,
          ...stats,
        }));
      } catch (err) {
        setError(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return { data, loading, error };
}
