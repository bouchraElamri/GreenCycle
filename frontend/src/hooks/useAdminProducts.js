import { useCallback, useEffect, useState } from "react";
import adminApi from "../api/adminApi";

export default function useAdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Missing auth token");

      const [allProducts, categories] = await Promise.all([
        adminApi.getProductsForReview(token),
        adminApi.getCategories(),
      ]);

      const categoryMap = new Map(
        (Array.isArray(categories) ? categories : []).map((category) => [
          String(category._id),
          category.name,
        ])
      );

      const pendingProducts = Array.isArray(allProducts)
        ? allProducts
            .filter((product) => !product.isApproved)
            .map((product) => ({
              ...product,
              categoryName:
                categoryMap.get(String(product.category)) ||
                product.category?.name ||
                "-",
            }))
        : [];

      setProducts(pendingProducts);
    } catch (err) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const updateApproval = async (productId, isApproved) => {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("Missing auth token");

    await adminApi.setProductApproval(token, productId, isApproved);

    // Remove from pending list once admin validates/rejects.
    setProducts((prev) => prev.filter((product) => product._id !== productId));
  };

  return {
    products,
    loading,
    error,
    reload: loadProducts,
    updateApproval,
  };
}
