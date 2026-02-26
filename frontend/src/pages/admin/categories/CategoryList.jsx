import CategoryAdd from "./CategoryAdd";
import CategoryEdit from "./CategoryEdit";
import useAdminCategories from "../../../hooks/useAdminCategories";

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString();
};

export default function CategoryList() {
  const {
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
  } = useAdminCategories();

  return (
    <section className="w-full font-nexa">
      <CategoryAdd
        showAddForm={showAddForm}
        setShowAddForm={setShowAddForm}
        addForm={addForm}
        setAddForm={setAddForm}
        handleAdd={handleAdd}
        submitting={submitting}
      />

      {loading && <p className="p-4 text-gray">Loading categories...</p>}
      {error && !loading && <p className="p-4 text-red">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto rounded-2xl border border-white-broken bg-white-intense">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-green-light/35 text-gray">
              <tr>
                <th className="px-4 py-3 text-sm font-bold">Name</th>
                <th className="px-4 py-3 text-sm font-bold">Description</th>
                <th className="px-4 py-3 text-sm font-bold">Created At</th>
                <th className="px-4 py-3 text-sm font-bold text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-4 text-gray">
                    No categories found.
                  </td>
                </tr>
              ) : (
                categories.map((category) => {
                  const isEditing = editingId === category._id;
                  return (
                    <tr key={category._id} className="border-t border-white-broken/80">
                      <CategoryEdit
                        category={category}
                        isEditing={isEditing}
                        editForm={editForm}
                        setEditForm={setEditForm}
                        submitting={submitting}
                        startEdit={startEdit}
                        handleUpdate={handleUpdate}
                        cancelEdit={cancelEdit}
                        handleDelete={handleDelete}
                        formatDate={formatDate}
                      />
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
