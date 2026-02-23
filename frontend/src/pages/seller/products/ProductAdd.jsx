import { useEffect, useState } from "react";
import sellerApi from "../../../api/sellerApi";

const initialForm = {
  name: "",
  description: "",
  price: "",
  quantity: "",
  category: "",
};

export default function ProductAdd() {
  const [form, setForm] = useState(initialForm);
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
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

  function onChangeField(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function onSelectImages(event) {
    const fileList = Array.from(event.target.files || []);
    setImages(fileList.slice(0, 5));
  }

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await sellerApi.addProduct({ ...form, images });
      setSuccess("Product created successfully.");
      setForm(initialForm);
      setImages([]);
    } catch (err) {
      setError(err?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  }

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
              <select
                name="category"
                value={form.category}
                onChange={onChangeField}
                required
                className="mt-1 w-full rounded-xl border border-green-light px-3 py-2 bg-white"
                disabled={loadingCategories}
              >
                <option value="">{loadingCategories ? "Loading..." : "Select category"}</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
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
            <span className="text-sm text-gray-600">Images (max 5)</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={onSelectImages}
              className="mt-1 block w-full rounded-xl border border-green-light bg-white px-3 py-2"
            />
            <p className="mt-1 text-xs text-gray-600">{images.length} file(s) selected</p>
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
