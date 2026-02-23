import { useEffect, useMemo, useState } from "react";
import sellerApi from "../../../api/sellerApi";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editProduct, setEditProduct] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    setError("");

    try {
      const [productsData, categoriesData, profileData] = await Promise.all([
        sellerApi.getProducts(),
        sellerApi.getCategories(),
        sellerApi.getSellerProfile().catch(() => null),
      ]);

      const profile = profileData?.data || profileData || null;
      const sellerId =
        profile?._id ||
        localStorage.getItem("sellerId") ||
        JSON.parse(localStorage.getItem("user") || "{}")?.sellerId ||
        "";

      const scopedProducts = sellerId
        ? (productsData || []).filter((item) => String(item.seller) === String(sellerId))
        : productsData || [];

      setProducts(scopedProducts);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (err) {
      setError(err?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  async function onDelete(productId) {
    const confirmed = window.confirm("Delete this product?");
    if (!confirmed) return;

    try {
      await sellerApi.deleteProduct(productId);
      setProducts((prev) => prev.filter((item) => item._id !== productId));
    } catch (err) {
      setError(err?.message || "Failed to delete product");
    }
  }

  function startEdit(product) {
    setEditProduct({
      _id: product._id,
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      quantity: product.quantity ?? "",
      category: typeof product.category === "object" ? product.category?._id : product.category || "",
      images: [],
    });
  }

  async function submitEdit(event) {
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
  }

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

  return (
    <section className="space-y-4">
      <div className="rounded-2xl bg-white-intense p-5 shadow">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
          <h2 className="text-2xl font-bold text-green-dark">Your Products</h2>
          <button
            type="button"
            className="rounded-xl border border-green-medium text-green-medium px-4 py-2 font-bold"
            onClick={loadProducts}
          >
            Refresh
          </button>
        </div>

        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search in your products..."
          className="mt-4 w-full rounded-xl border border-green-light px-3 py-2"
        />

        {error && <div className="mt-4 rounded-lg bg-red-100 text-red-700 p-3">{error}</div>}

        {loading ? (
          <p className="mt-6 text-gray-600">Loading products...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="mt-6 text-gray-600">No product found.</p>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-[850px] w-full text-left">
              <thead>
                <tr className="text-sm text-gray-600 border-b">
                  <th className="py-2">Name</th>
                  <th className="py-2">Price</th>
                  <th className="py-2">Stock</th>
                  <th className="py-2">Category</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((item) => {
                  const categoryId =
                    typeof item.category === "object" ? item.category?._id : item.category;
                  const categoryLabel =
                    (typeof item.category === "object" && item.category?.name) ||
                    categoryById.get(String(categoryId)) ||
                    "-";

                  return (
                    <tr key={item._id} className="border-b last:border-0">
                      <td className="py-3">
                        <p className="font-bold text-green-dark">{item.name}</p>
                        <p className="text-xs text-gray-600 line-clamp-1">{item.description}</p>
                      </td>
                      <td className="py-3">${Number(item.price || 0).toFixed(2)}</td>
                      <td className="py-3">{item.quantity ?? 0}</td>
                      <td className="py-3">{categoryLabel}</td>
                      <td className="py-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            item.isApproved ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.isApproved ? "Approved" : "Pending"}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(item)}
                            className="rounded-lg px-3 py-1 bg-green-light text-green-dark font-bold"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(item._id)}
                            className="rounded-lg px-3 py-1 bg-red-100 text-red-700 font-bold"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editProduct && (
        <div className="fixed inset-0 z-40 bg-black/40 p-4 flex items-center justify-center">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-xl font-bold text-green-dark">Edit Product</h3>

            <form onSubmit={submitEdit} className="mt-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={editProduct.name}
                  onChange={(event) =>
                    setEditProduct((prev) => ({ ...prev, name: event.target.value }))
                  }
                  className="w-full rounded-xl border border-green-light px-3 py-2"
                  placeholder="Name"
                  required
                />
                <select
                  value={editProduct.category}
                  onChange={(event) =>
                    setEditProduct((prev) => ({ ...prev, category: event.target.value }))
                  }
                  className="w-full rounded-xl border border-green-light px-3 py-2 bg-white"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                value={editProduct.description}
                onChange={(event) =>
                  setEditProduct((prev) => ({ ...prev, description: event.target.value }))
                }
                className="w-full rounded-xl border border-green-light px-3 py-2"
                rows={3}
                placeholder="Description"
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="number"
                  min="0"
                  value={editProduct.price}
                  onChange={(event) =>
                    setEditProduct((prev) => ({ ...prev, price: event.target.value }))
                  }
                  className="w-full rounded-xl border border-green-light px-3 py-2"
                  placeholder="Price"
                  required
                />
                <input
                  type="number"
                  min="0"
                  value={editProduct.quantity}
                  onChange={(event) =>
                    setEditProduct((prev) => ({ ...prev, quantity: event.target.value }))
                  }
                  className="w-full rounded-xl border border-green-light px-3 py-2"
                  placeholder="Quantity"
                  required
                />
              </div>

              <input
                type="file"
                accept="image/*"
                multiple
                className="w-full rounded-xl border border-green-light px-3 py-2"
                onChange={(event) =>
                  setEditProduct((prev) => ({
                    ...prev,
                    images: Array.from(event.target.files || []).slice(0, 5),
                  }))
                }
              />

              <div className="pt-2 flex items-center gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setEditProduct(null)}
                  className="rounded-xl bg-gray-100 px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-green-dark text-white-intense px-4 py-2 font-bold disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
