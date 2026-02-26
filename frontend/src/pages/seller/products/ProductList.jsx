import useSellerProductList from "../../../hooks/useSellerProductList";
import ProductListHeader from "./components/ProductListHeader";
import ProductListTable from "./components/ProductListTable";
import ProductEditModal from "./components/ProductEditModal";

export default function ProductList() {
  const {
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
  } = useSellerProductList();

  return (
    <section className="space-y-4">
      <div className="rounded-2xl bg-white-intense p-5 shadow">
        <ProductListHeader query={query} setQuery={setQuery} onRefresh={loadProducts} />

        {error && <div className="mt-4 rounded-lg bg-red-100 text-red-700 p-3">{error}</div>}

        {loading ? (
          <p className="mt-6 text-gray-600">Loading products...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="mt-6 text-gray-600">No product found.</p>
        ) : (
          <ProductListTable
            products={filteredProducts}
            categoryById={categoryById}
            onEdit={startEdit}
            onDelete={onDelete}
          />
        )}
      </div>

      <ProductEditModal
        editProduct={editProduct}
        categories={categories}
        saving={saving}
        onClose={() => setEditProduct(null)}
        onSubmit={submitEdit}
        setEditProduct={setEditProduct}
      />
    </section>
  );
}
