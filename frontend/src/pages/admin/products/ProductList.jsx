import { useMemo, useState } from "react";
import useAdminProducts from "../../../hooks/useAdminProducts";

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString();
};

export default function ProductList() {
  const { products, loading, error, updateApproval, rejectProduct } = useAdminProducts();
  const [submittingId, setSubmittingId] = useState(null);
  const [confirmRejectId, setConfirmRejectId] = useState(null);
  const [expandedProductId, setExpandedProductId] = useState(null);
  const [expandedCategoryId, setExpandedCategoryId] = useState(null);

  const confirmRejectProduct = useMemo(
    () => products.find((product) => product._id === confirmRejectId) || null,
    [products, confirmRejectId]
  );

  const handleApprove = async (productId) => {
    try {
      setSubmittingId(productId);
      await updateApproval(productId, true);
    } finally {
      setSubmittingId(null);
    }
  };

  const openRejectModal = (productId) => {
    setConfirmRejectId(productId);
  };

  const closeRejectModal = () => {
    setConfirmRejectId(null);
  };

  const handleReject = async () => {
    if (!confirmRejectId) return;

    try {
      setSubmittingId(confirmRejectId);
      await rejectProduct(confirmRejectId);
      setConfirmRejectId(null);
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <section className="w-full font-nexa">
      <h1 className="mb-5 text-4xl font-black text-gray sm:mb-6 sm:text-5xl">Products</h1>

      {loading && <p className="p-4 text-gray">Loading products...</p>}
      {error && !loading && <p className="p-4 text-red">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto rounded-2xl border border-white-broken bg-white-intense">
          <table className="w-full min-w-[860px] table-fixed text-left">
            <thead className="bg-green-light/35 text-gray">
              <tr>
                <th className="w-[20%] border-r border-white-broken px-3 py-3 text-sm font-bold">Product ID</th>
                <th className="w-[13%] border-r border-white-broken px-3 py-3 text-sm font-bold">Name</th>
                <th className="w-[14%] border-r border-white-broken px-3 py-3 text-sm font-bold">Date</th>
                <th className="w-[9%] border-r border-white-broken px-3 py-3 text-sm font-bold">Price</th>
                <th className="w-[18%] border-r border-white-broken px-3 py-3 text-sm font-bold">Category</th>
                <th className="w-[26%] px-3 py-3 text-sm font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-4 text-gray">
                    No products pending approval.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="border-t border-white-broken/80">
                    <td className="border-r border-white-broken/80 px-3 py-3 text-gray">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedProductId((prev) =>
                            prev === product._id ? null : product._id
                          )
                        }
                        className={`max-w-[170px] text-left text-gray transition hover:text-green-dark ${
                          expandedProductId === product._id ? "break-all" : "truncate"
                        }`}
                        title="Click to show/hide full ID"
                      >
                        {product._id}
                      </button>
                    </td>
                    <td className="border-r border-white-broken/80 px-3 py-3 text-gray">{product.name || "-"}</td>
                    <td className="border-r border-white-broken/80 px-3 py-3 text-gray">{formatDate(product.createdAt)}</td>
                    <td className="border-r border-white-broken/80 px-3 py-3 text-gray">{product.price ?? "-"}</td>
                    <td className="border-r border-white-broken/80 px-3 py-3 text-gray">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedCategoryId((prev) =>
                            prev === product._id ? null : product._id
                          )
                        }
                        className={`max-w-[170px] text-left text-gray transition hover:text-green-dark ${
                          expandedCategoryId === product._id ? "break-all" : "truncate"
                        }`}
                        title="Click to show/hide full category"
                      >
                        {product.categoryName || "-"}
                      </button>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleApprove(product._id)}
                          disabled={submittingId === product._id}
                          className="rounded-full bg-green-tolerated px-4 py-2 text-sm font-bold text-white-intense transition hover:bg-green-dark disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => openRejectModal(product._id)}
                          disabled={submittingId === product._id}
                          className="rounded-full bg-red px-7 py-2 text-sm font-bold text-white-intense transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {confirmRejectProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray/40 p-4">
          <div className="w-full max-w-md rounded-2xl border border-white-broken bg-white-intense p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-gray">Reject Product</h2>
            <p className="mt-3 text-gray">
              Are you sure you want to reject <strong>{confirmRejectProduct.name}</strong>?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeRejectModal}
                disabled={submittingId === confirmRejectId}
                className="rounded-full border border-white-broken px-4 py-2 text-sm font-bold text-gray disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={submittingId === confirmRejectId}
                className="rounded-full bg-red px-4 py-2 text-sm font-bold text-white-intense disabled:opacity-50"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
