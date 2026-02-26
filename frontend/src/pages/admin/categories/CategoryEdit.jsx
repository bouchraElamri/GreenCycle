export default function CategoryEdit({
  category,
  isEditing,
  editForm,
  setEditForm,
  submitting,
  startEdit,
  handleUpdate,
  cancelEdit,
  handleDelete,
  formatDate,
}) {
  return (
    <>
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
