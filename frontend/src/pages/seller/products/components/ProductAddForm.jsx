import { RiArrowDownSLine } from "react-icons/ri";

export default function ProductAddForm({
  form,
  images,
  categories,
  loadingCategories,
  loading,
  error,
  success,
  openCategory,
  categoryRef,
  selectedCategoryLabel,
  onChangeField,
  onToggleCategory,
  onSelectCategory,
  onSelectImages,
  onRemoveImage,
  onSubmit,
}) {
  return (
    <section className="max-w-4xl mx-auto">
      <div className="rounded-2xl bg-white-intense shadow p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-green-dark">Add New Product</h2>
        <p className="mt-1 text-sm text-gray-600">
          Fill in details and upload up to 5 images to publish your product.
        </p>

        {error && <div className="mt-4 rounded-lg bg-red-100 text-red-700 p-3">{error}</div>}
        {success && <div className="mt-4 rounded-lg bg-green-100 text-green-700 p-3">{success}</div>}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm text-gray-600">Product name</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={onChangeField}
                required
                className="mt-1 w-full rounded-xl border border-green-light px-3 py-2"
                placeholder="Recycled Desk Organizer"
              />
            </label>

            <label className="block">
              <span className="text-sm text-gray-600">Category</span>
              <input type="hidden" name="category" value={form.category} required readOnly />
              <div ref={categoryRef} className="relative mt-1 w-full">
                <button
                  type="button"
                  onClick={onToggleCategory}
                  className="flex w-full bg-white-intense font-nexa text-sm text-gray-600 h-10 border border-green-light px-3 py-2 rounded-xl justify-between items-center disabled:opacity-60"
                  disabled={loadingCategories}
                >
                  {selectedCategoryLabel}
                  <RiArrowDownSLine size={18} />
                </button>

                {openCategory && (
                  <div className="absolute mt-2 w-full bg-white-intense font-nexa rounded-2xl shadow-lg overflow-hidden z-20 max-h-48 overflow-y-auto">
                    {categories.map((category) => (
                      <button
                        key={category._id}
                        type="button"
                        onClick={() => onSelectCategory(category._id)}
                        className="block w-full px-3 py-2 text-left hover:bg-white-broken cursor-pointer text-gray-700 transition"
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </label>
          </div>

          <label className="block">
            <span className="text-sm text-gray-600">Description</span>
            <textarea
              name="description"
              value={form.description}
              onChange={onChangeField}
              required
              rows={4}
              className="mt-1 w-full rounded-xl border border-green-light px-3 py-2"
              placeholder="Describe material, dimensions and usage..."
            />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm text-gray-600">Price</span>
              <input
                type="number"
                min="0"
                step="0.01"
                name="price"
                value={form.price}
                onChange={onChangeField}
                required
                className="mt-1 w-full rounded-xl border border-green-light px-3 py-2"
              />
            </label>

            <label className="block">
              <span className="text-sm text-gray-600">Quantity</span>
              <input
                type="number"
                min="0"
                step="1"
                name="quantity"
                value={form.quantity}
                onChange={onChangeField}
                required
                className="mt-1 w-full rounded-xl border border-green-light px-3 py-2"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm text-gray-600">Images (max 5, add one by one)</span>
            <input
              type="file"
              accept="image/*"
              onChange={onSelectImages}
              disabled={images.length >= 5}
              className="mt-1 block w-full rounded-xl border border-green-light bg-white px-3 py-2"
            />
            <p className="mt-1 text-xs text-gray-600">{images.length} / 5 selected</p>

            {images.length > 0 && (
              <ul className="mt-3 space-y-2">
                {images.map((file, index) => (
                  <li
                    key={`${file.name}-${file.lastModified}-${index}`}
                    className="flex items-center justify-between rounded-lg border border-green-light bg-white-intense px-3 py-2"
                  >
                    <span className="truncate pr-3 text-sm text-gray-700">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => onRemoveImage(index)}
                      className="rounded-full border border-red-200 bg-red-100 px-3 py-1 text-xs font-bold text-red-700 transition hover:opacity-90"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </label>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-green-dark text-white-intense px-6 py-3 font-bold hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
