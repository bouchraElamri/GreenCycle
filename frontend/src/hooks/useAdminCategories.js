import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import adminApi from "../api/adminApi";

const API_ORIGIN = (process.env.REACT_APP_API_URL || "http://localhost:5000/api").replace(
  /\/api\/?$/,
  ""
);
const MAX_CATEGORY_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

const isBlobUrl = (value) => typeof value === "string" && value.startsWith("blob:");
const revokeIfBlob = (value) => {
  if (isBlobUrl(value)) URL.revokeObjectURL(value);
};

const resolveImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  if (path.startsWith("/")) return `${API_ORIGIN}${path}`;
  return `${API_ORIGIN}/${path}`;
};

export default function useAdminCategories() {
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

  useEffect(
    () => () => {
      if (isBlobUrl(addImagePreview)) URL.revokeObjectURL(addImagePreview);
    },
    [addImagePreview]
  );

  useEffect(
    () => () => {
      if (isBlobUrl(editImagePreview)) URL.revokeObjectURL(editImagePreview);
    },
    [editImagePreview]
  );

  const loadCategories = useCallback(async () => {
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
  }, [token]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const validateImageFile = useCallback((file) => {
    if (!file) return "";
    if (!file.type?.startsWith("image/")) return "Image must be a valid image file";
    if (file.size > MAX_CATEGORY_IMAGE_SIZE) return "Image file must not exceed 5MB";
    return "";
  }, []);

  const handleAddImageChange = useCallback(
    (file) => {
      const fileError = validateImageFile(file);
      if (fileError) {
        toast.error(fileError);
        setAddImageFile(null);
        setAddImagePreview((prev) => {
          revokeIfBlob(prev);
          return "";
        });
        return false;
      }

      setAddImageFile(file || null);
      setAddImagePreview((prev) => {
        revokeIfBlob(prev);
        return file ? URL.createObjectURL(file) : "";
      });
      return true;
    },
    [validateImageFile]
  );

  const handleEditImageChange = useCallback(
    (file, fallbackImagePath = "") => {
      const fileError = validateImageFile(file);
      if (fileError) {
        toast.error(fileError);
        setEditImageFile(null);
        setEditImagePreview((prev) => {
          revokeIfBlob(prev);
          return resolveImageUrl(fallbackImagePath);
        });
        return false;
      }

      setEditImageFile(file || null);
      setEditImagePreview((prev) => {
        revokeIfBlob(prev);
        return file ? URL.createObjectURL(file) : resolveImageUrl(fallbackImagePath);
      });
      return true;
    },
    [validateImageFile]
  );

  const handleAdd = useCallback(
    async (event) => {
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
        await adminApi.createCategory(token, { name, description, imgFile: addImageFile });
        setAddForm({ name: "", description: "" });
        setAddImageFile(null);
        setAddImagePreview((prev) => {
          revokeIfBlob(prev);
          return "";
        });
        setShowAddForm(false);
        await loadCategories();
      } catch (err) {
        setError(err?.message || "Failed to create category");
      } finally {
        setSubmitting(false);
      }
    },
    [addForm, addImageFile, loadCategories, token]
  );

  const startEdit = useCallback((category) => {
    setEditingId(category._id);
    setEditForm({
      name: category.name || "",
      description: category.description || "",
    });
    setEditImageFile(null);
    setEditImagePreview(resolveImageUrl(category.img));
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditForm({ name: "", description: "" });
    setEditImageFile(null);
    setEditImagePreview((prev) => {
      revokeIfBlob(prev);
      return "";
    });
  }, []);

  const handleUpdate = useCallback(
    async (event) => {
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
    },
    [cancelEdit, editForm, editImageFile, editingId, loadCategories, token]
  );

  const handleDelete = useCallback(
    async (categoryId) => {
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
    },
    [cancelEdit, editingId, loadCategories, token]
  );

  return {
    categories,
    loading,
    error,
    showAddForm,
    setShowAddForm,
    addForm,
    setAddForm,
    addImageFile,
    addImagePreview,
    handleAddImageChange,
    editingId,
    editForm,
    setEditForm,
    editImageFile,
    editImagePreview,
    handleEditImageChange,
    submitting,
    handleAdd,
    startEdit,
    cancelEdit,
    handleUpdate,
    handleDelete,
    resolveImageUrl,
  };
}
