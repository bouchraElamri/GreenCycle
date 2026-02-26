import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import adminApi from "../api/adminApi";

export default function useAdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", description: "" });
  const [submitting, setSubmitting] = useState(false);

  const token = useMemo(() => localStorage.getItem("authToken"), []);

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
        await adminApi.createCategory(token, { name, description });
        setAddForm({ name: "", description: "" });
        setShowAddForm(false);
        await loadCategories();
      } catch (err) {
        setError(err?.message || "Failed to create category");
      } finally {
        setSubmitting(false);
      }
    },
    [addForm, loadCategories, token]
  );

  const startEdit = useCallback((category) => {
    setEditingId(category._id);
    setEditForm({
      name: category.name || "",
      description: category.description || "",
    });
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditForm({ name: "", description: "" });
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
        await adminApi.updateCategory(token, editingId, { name, description });
        cancelEdit();
        await loadCategories();
      } catch (err) {
        setError(err?.message || "Failed to update category");
      } finally {
        setSubmitting(false);
      }
    },
    [cancelEdit, editForm, editingId, loadCategories, token]
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
    editingId,
    editForm,
    setEditForm,
    submitting,
    handleAdd,
    startEdit,
    cancelEdit,
    handleUpdate,
    handleDelete,
  };
}
