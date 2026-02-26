import { useEffect, useState } from "react";
import sellerApi from "../api/sellerApi";

export default function useSellerProductAdd() {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadCategories() {
      setLoadingCategories(true);
      try {
        const data = await sellerApi.getCategories();
        if (mounted) setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        if (mounted) setError(err?.message || "Failed to load categories");
      } finally {
        if (mounted) setLoadingCategories(false);
      }
    }

    loadCategories();
    return () => {
      mounted = false;
    };
  }, []);

  const createProduct = async (payload) => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await sellerApi.addProduct(payload);
      setSuccess("Product created successfully.");
      return true;
    } catch (err) {
      setError(err?.message || "Failed to create product");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    categories,
    loadingCategories,
    loading,
    error,
    success,
    setError,
    setSuccess,
    createProduct,
  };
}
