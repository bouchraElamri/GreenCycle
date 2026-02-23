import { useEffect, useState } from "react";
import adminApi from "../api/adminApi";
import publicApi from "../api/publicApi";

export default function useUsers(initialPageOrSellerId = 1, initialLimit = 10) {
  const isSellerMode =
    typeof initialPageOrSellerId === "string" ||
    initialPageOrSellerId === null;
  const sellerId = isSellerMode ? initialPageOrSellerId : null;

  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    page: isSellerMode ? 1 : initialPageOrSellerId,
    limit: initialLimit,
    total: 0,
    totalPages: 0,
  });
  const [q, setQ] = useState("");

  const [seller, setSeller] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isSellerMode) return;

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
  }, [isSellerMode, pagination.page, pagination.limit, q]);

  useEffect(() => {
    if (!isSellerMode) return;
    if (!sellerId) {
      setSeller(null);
      setLoading(false);
      return;
    }

    const fetchSeller = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await publicApi.getSeller(sellerId);
        setSeller(data);
      } catch (err) {
        setError(err.message || "Failed to fetch seller");
      } finally {
        setLoading(false);
      }
    };

    fetchSeller();
  }, [isSellerMode, sellerId]);

  const setPage = (nextPage) => {
    if (isSellerMode) return;
    setPagination((prev) => {
      const resolvedPage =
        typeof nextPage === "function" ? nextPage(prev.page) : nextPage;
      const safePage = Math.max(Number(resolvedPage) || 1, 1);
      return { ...prev, page: safePage };
    });
  };

  const setLimit = (nextLimit) => {
    if (isSellerMode) return;
    setPagination((prev) => ({
      ...prev,
      limit: Number(nextLimit) || prev.limit,
      page: 1,
    }));
  };

  return {
    users,
    pagination,
    q,
    setQ,
    setPage,
    setLimit,
    seller,
    loading,
    error,
  };
}
