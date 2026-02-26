import { useEffect, useMemo, useState } from "react";
import adminApi from "../../../api/adminApi";
import toast from "react-hot-toast";

const API_ORIGIN = (process.env.REACT_APP_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");
const MAX_CATEGORY_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString();
};

const resolveImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  if (path.startsWith("/")) return `${API_ORIGIN}${path}`;
  return `${API_ORIGIN}/${path}`;
};

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", description: "" });
  const [addImageFile, setAddImageFile] = useState(null);
  const [addImagePreview, setAddImagePreview] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", description: "" });
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const token = useMemo(() => localStorage.getItem("authToken"), []);

  const validateImageFile = (file) => {
    if (!file) return "";
    if (!file.type?.startsWith("image/")) return "Image must be a valid image file";
    if (file.size > MAX_CATEGORY_IMAGE_SIZE) return "Image file must not exceed 5MB";
    return "";
  };

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");
      if (!token) throw new Error("Missing auth token");
      const data = await adminApi.getAdminCategories(token);
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    return () => {
      if (addImagePreview && addImagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(addImagePreview);
      }
    };
  }, [addImagePreview]);

  useEffect(() => {
    return () => {
      if (editImagePreview && editImagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(editImagePreview);
      }
    };
  }, [editImagePreview]);

  const handleAdd = async (event) => {
    event.preventDefault();
    const name = addForm.name.trim();
    const description = addForm.description.trim();

    if (!name || !description) {
      toast.error("Name and description are required");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      await adminApi.createCategory(token, {
        name,
        description,
        imgFile: addImageFile,
      });
      setAddForm({ name: "", description: "" });
      setAddImageFile(null);
      setAddImagePreview("");
      setShowAddForm(false);
      await loadCategories();
    } catch (err) {
      setError(err?.message || "Failed to create category");
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (category) => {
    setEditingId(category._id);
    setEditForm({
      name: category.name || "",
      description: category.description || "",
    });
    setEditImageFile(null);
    setEditImagePreview(resolveImageUrl(category.img));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: "", description: "" });
    setEditImageFile(null);
    setEditImagePreview("");
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    if (!editingId) return;
    const name = editForm.name.trim();
    const description = editForm.description.trim();

    if (!name || !description) {
      toast.error("Name and description are required");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      await adminApi.updateCategory(token, editingId, {
        name,
        description,
        imgFile: editImageFile,
      });
      cancelEdit();
      await loadCategories();
    } catch (err) {
      setError(err?.message || "Failed to update category");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (categoryId) => {
    const confirmed = window.confirm("Are you sure you want to delete this category?");
    if (!confirmed) return;

    try {
      setSubmitting(true);
      setError("");
      await adminApi.deleteCategory(token, categoryId);
      if (editingId === categoryId) {
        cancelEdit();
      }
      await loadCategories();
    } catch (err) {
      setError(err?.message || "Failed to delete category");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="w-full font-nexa">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 sm:mb-6">
        <h1 className="text-4xl font-black text-gray sm:text-5xl">Categories</h1>
        <button
          type="button"
          onClick={() => setShowAddForm((prev) => !prev)}
          className="rounded-full bg-green-tolerated px-5 py-2 text-sm font-bold text-white-intense transition hover:bg-green-dark"
        >
          {showAddForm ? "Close" : "Add Category"}
        </button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleAdd}
          noValidate
          className="mb-4 rounded-2xl border border-white-broken bg-white-intense p-4"
        >
          <div className="grid gap-3 md:grid-cols-[1fr_1.2fr_1.3fr_auto] md:items-end">
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray">Name</label>
              <input
                type="text"
                value={addForm.name}
                onChange={(e) => setAddForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Category name"
                className="h-10 w-full rounded-full border border-white-broken px-4 text-sm text-gray outline-none focus:border-green-tolerated"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray">Description</label>
              <input
                type="text"
                value={addForm.description}
                onChange={(e) =>
                  setAddForm((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Description"
                className="h-10 w-full rounded-full border border-white-broken px-4 text-sm text-gray outline-none focus:border-green-tolerated"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray">Image file</label>
              <label
                htmlFor="add-category-image"
                className="flex h-10 w-full cursor-pointer items-center justify-center rounded-full border border-white-broken bg-white-intense px-4 text-sm font-semibold text-green-dark transition hover:bg-green-light/30"
              >
                {addImageFile ? "Change image" : "Choose image"}
              </label>
              <input
                id="add-category-image"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  const fileError = validateImageFile(file);
                  if (fileError) {
                    toast.error(fileError);
                    setAddImageFile(null);
                    setAddImagePreview("");
                    e.target.value = "";
                    return;
                  }

                  setAddImageFile(file);
                  setAddImagePreview(file ? URL.createObjectURL(file) : "");
                }}
                className="hidden"
              />
              <p className="mt-1 truncate text-xs text-gray">
                {addImageFile?.name || "No file selected"}
              </p>
              {addImagePreview ? (
                <img src={addImagePreview} alt="New category preview" className="mt-2 h-12 w-20 rounded object-cover" />
              ) : null}
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="h-10 rounded-full bg-green-dark px-5 text-sm font-bold text-white-intense disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Create"}
            </button>
          </div>
        </form>
      )}

      {loading && <p className="p-4 text-gray">Loading categories...</p>}
      {error && !loading && <p className="p-4 text-red">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto rounded-2xl border border-white-broken bg-white-intense">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-green-light/35 text-gray">
              <tr>
                <th className="px-4 py-3 text-sm font-bold">Name</th>
                <th className="px-4 py-3 text-sm font-bold">Description</th>
                <th className="px-4 py-3 text-sm font-bold">Image</th>
                <th className="px-4 py-3 text-sm font-bold">Created At</th>
                <th className="px-4 py-3 text-sm font-bold text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-4 text-gray">
                    No categories found.
                  </td>
                </tr>
              ) : (
                categories.map((category) => {
                  const isEditing = editingId === category._id;
                  return (
                    <tr key={category._id} className="border-t border-white-broken/80">
                      <td className="px-4 py-3 text-gray">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) =>
                              setEditForm((prev) => ({ ...prev, name: e.target.value }))
                            }
                            className="h-9 w-full rounded-full border border-white-broken px-3 text-sm outline-none focus:border-green-tolerated"
                          />
                        ) : (
                          category.name || "-"
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.description}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                            className="h-9 w-full rounded-full border border-white-broken px-3 text-sm outline-none focus:border-green-tolerated"
                          />
                        ) : (
                          category.description || "-"
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray">
                        {isEditing ? (
                          <div className="space-y-2">
                            <label
                              htmlFor={`edit-category-image-${category._id}`}
                              className="flex h-9 w-full cursor-pointer items-center justify-center rounded-full border border-white-broken bg-white-intense px-auto text-xs font-semibold text-green-dark transition hover:bg-green-light/30"
                            >
                              {editImageFile ? "Change image" : "Choose image"}
                            </label>
                            <input
                              id={`edit-category-image-${category._id}`}
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                const fileError = validateImageFile(file);
                                if (fileError) {
                                  toast.error(fileError);
                                  setEditImageFile(null);
                                  setEditImagePreview(resolveImageUrl(category.img));
                                  e.target.value = "";
                                  return;
                                }

                                setEditImageFile(file);
                                setEditImagePreview(file ? URL.createObjectURL(file) : resolveImageUrl(category.img));
                              }}
                              className="hidden"
                            />
                            <p className="truncate text-xs text-gray">
                              {editImageFile?.name || "No file selected"}
                            </p>
                            {editImagePreview ? (
                              <img
                                src={editImagePreview}
                                alt={category.name || "Category preview"}
                                className="h-10 w-16 rounded object-cover"
                              />
                            ) : null}
                          </div>
                        ) : resolveImageUrl(category.img) ? (
                          <img
                            src={resolveImageUrl(category.img)}
                            alt={category.name || "Category"}
                            className="h-10 w-16 rounded object-cover"
                          />
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray">{formatDate(category.createdAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-2">
                          {isEditing ? (
                            <>
                              <button
                                type="button"
                                onClick={handleUpdate}
                                disabled={submitting}
                                className="rounded-full bg-green-tolerated px-4 py-2 text-xs font-bold text-white-intense disabled:opacity-60"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={cancelEdit}
                                disabled={submitting}
                                className="rounded-full border border-white-broken px-4 py-2 text-xs font-bold text-gray disabled:opacity-60"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => startEdit(category)}
                                className="rounded-full bg-green-dark px-4 py-2 text-xs font-bold text-white-intense"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(category._id)}
                                disabled={submitting}
                                className="rounded-full bg-red px-4 py-2 text-xs font-bold text-white-intense disabled:opacity-60"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
