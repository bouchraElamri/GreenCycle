import { useEffect, useMemo, useState } from "react";
import sellerApi from "../api/sellerApi";

export default function useSellerProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editProduct, setEditProduct] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const [productsData, categoriesData] = await Promise.all([
        sellerApi.getSellerProducts(),
        sellerApi.getCategories(),
      ]);

      setProducts(Array.isArray(productsData) ? productsData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (err) {
      setError(err?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const onDelete = async (productId) => {
    const confirmed = window.confirm("Delete this product?");
    if (!confirmed) return;

    try {
      await sellerApi.deleteProduct(productId);
      setProducts((prev) => prev.filter((item) => item._id !== productId));
    } catch (err) {
      setError(err?.message || "Failed to delete product");
    }
  };

  const startEdit = (product) => {
    setEditProduct({
      _id: product._id,
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      quantity: product.quantity ?? "",
      category: typeof product.category === "object" ? product.category?._id : product.category || "",
      images: [],
    });
  };

  const submitEdit = async (event) => {
    event.preventDefault();
    if (!editProduct) return;

    setSaving(true);
    setError("");
    try {
      const updated = await sellerApi.updateProduct(editProduct._id, editProduct);
      setProducts((prev) => prev.map((item) => (item._id === updated._id ? updated : item)));
      setEditProduct(null);
    } catch (err) {
      setError(err?.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  const categoryById = useMemo(() => {
    const map = new Map();
    categories.forEach((category) => map.set(String(category._id), category.name));
    return map;
  }, [categories]);

  const filteredProducts = useMemo(() => {
    const safeQuery = query.trim().toLowerCase();
    if (!safeQuery) return products;
    return products.filter((item) => {
      const name = String(item.name || "").toLowerCase();
      const description = String(item.description || "").toLowerCase();
      return name.includes(safeQuery) || description.includes(safeQuery);
    });
  }, [products, query]);

  return {
    query,
    setQuery,
    loading,
    error,
    saving,
    editProduct,
    setEditProduct,
    categories,
    categoryById,
    filteredProducts,
    loadProducts,
    onDelete,
    startEdit,
    submitEdit,
  };
}
