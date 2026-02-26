export default function ProductListTable({
  products,
  categoryById,
  onEdit,
  onDelete,
}) {
  return (
    <div className="mt-6 overflow-x-auto">
      <table className="min-w-[850px] w-full text-left">
        <thead>
          <tr className="text-sm text-gray-600 border-b">
            <th className="py-2">Name</th>
            <th className="py-2">Price</th>
            <th className="py-2">Stock</th>
            <th className="py-2">Category</th>
            <th className="py-2">Status</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((item) => {
            const categoryId =
              typeof item.category === "object" ? item.category?._id : item.category;
            const categoryLabel =
              (typeof item.category === "object" && item.category?.name) ||
              categoryById.get(String(categoryId)) ||
              "-";

            return (
              <tr key={item._id} className="border-b last:border-0">
                <td className="py-3">
                  <p className="font-bold text-green-dark">{item.name}</p>
                  <p className="text-xs text-gray-600 line-clamp-1">{item.description}</p>
                </td>
                <td className="py-3">${Number(item.price || 0).toFixed(2)}</td>
                <td className="py-3">{item.quantity ?? 0}</td>
                <td className="py-3">{categoryLabel}</td>
                <td className="py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      item.isApproved ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.isApproved ? "Approved" : "Pending"}
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(item)}
                      className="rounded-lg px-3 py-1 bg-green-light text-green-dark font-bold"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(item._id)}
                      className="rounded-lg px-3 py-1 bg-red-100 text-red-700 font-bold"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
