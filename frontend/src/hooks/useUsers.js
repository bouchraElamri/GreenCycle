import { useEffect, useState } from "react";
import adminApi from "../api/adminApi";

export default function useUsers(initialPage = 1, initialLimit = 10) {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: initialLimit,
    total: 0,
    totalPages: 0,
  });
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Missing auth token");

        const result = await adminApi.getUsers(token, {
          page: pagination.page,
          limit: pagination.limit,
          q,
        });

        setUsers(result?.data || []);
        setPagination((prev) => ({
          ...prev,
          ...(result?.pagination || {}),
        }));
      } catch (err) {
        setError(err.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [pagination.page, pagination.limit, q]);

  const setPage = (nextPage) => {
    setPagination((prev) => ({ ...prev, page: nextPage }));
  };

  const setLimit = (nextLimit) => {
    setPagination((prev) => ({ ...prev, limit: Number(nextLimit), page: 1 }));
  };

  return {
    users,
    pagination,
    q,
    setQ,
    setPage,
    setLimit,
    loading,
    error,
  };
}
