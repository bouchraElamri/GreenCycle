export default function CategoryEdit({
  category,
  isEditing,
  editForm,
  setEditForm,
  editImageFile,
  editImagePreview,
  handleEditImageChange,
  submitting,
  startEdit,
  handleUpdate,
  cancelEdit,
  handleDelete,
  formatDate,
  resolveImageUrl,
}) {
  return (
    <>
      <td className="px-4 py-3 text-gray">
        {isEditing ? (
          <input
            type="text"
            value={editForm.name}
            onChange={(event) =>
              setEditForm((prev) => ({ ...prev, name: event.target.value }))
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
            onChange={(event) =>
              setEditForm((prev) => ({
                ...prev,
                description: event.target.value,
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
              className="flex h-9 w-full cursor-pointer items-center justify-center rounded-full border border-white-broken bg-white-intense px-3 text-xs font-semibold text-green-dark transition hover:bg-green-light/30"
            >
              {editImageFile ? "Change image" : "Choose image"}
            </label>
            <input
              id={`edit-category-image-${category._id}`}
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0] || null;
                const ok = handleEditImageChange(file, category.img);
                if (!ok) event.target.value = "";
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
    </>
  );
}
