export default function ProductEditModal({
  editProduct,
  categories,
  saving,
  onClose,
  onSubmit,
  setEditProduct,
}) {
  if (!editProduct) return null;

  return (
    <div className="fixed inset-0 z-40 bg-black/40 p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl rounded-2xl bg-white-intense p-6 shadow-xl">
        <h3 className="text-xl font-bold text-green-dark">Edit Product</h3>

        <form onSubmit={onSubmit} className="mt-4 space-y-3">
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
              onClick={onClose}
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
  );
}
