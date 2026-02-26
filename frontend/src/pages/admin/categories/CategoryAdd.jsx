export default function CategoryAdd({
  showAddForm,
  setShowAddForm,
  addForm,
  setAddForm,
  addImageFile,
  addImagePreview,
  handleAddImageChange,
  handleAdd,
  submitting,
}) {
  return (
    <>
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
          <div className="grid gap-3 md:grid-cols-12 md:items-start">
            <div className="md:col-span-3">
              <label className="mb-1 block text-sm font-semibold text-gray">Name</label>
              <input
                type="text"
                value={addForm.name}
                onChange={(e) => setAddForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Category name"
                className="h-10 w-full rounded-full border border-white-broken px-4 text-sm text-gray outline-none focus:border-green-tolerated"
              />
            </div>
            <div className="md:col-span-4">
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
            <div className="md:col-span-3">
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
                onChange={(event) => {
                  const file = event.target.files?.[0] || null;
                  const ok = handleAddImageChange(file);
                  if (!ok) event.target.value = "";
                }}
                className="hidden"
              />
              <p className="mt-1 h-4 truncate text-xs text-gray">
                {addImageFile?.name || "No file selected"}
              </p>
              {addImagePreview ? (
                <img
                  src={addImagePreview}
                  alt="New category preview"
                  className="mt-2 h-12 w-20 rounded object-cover"
                />
              ) : null}
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="h-10 rounded-full bg-green-dark px-5 text-sm font-bold text-white-intense disabled:cursor-not-allowed disabled:opacity-60 md:col-span-2 md:mt-6 md:self-start"
            >
              {submitting ? "Saving..." : "Create"}
            </button>
          </div>
        </form>
      )}
    </>
  );
}
