export default function OrderItemsTable({ items, openPreview, toAbsoluteUrl }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white-broken bg-white-intense">
      <table className="w-full min-w-[820px] text-left sm:min-w-[900px]">
        <thead className="bg-green-light/35 text-gray">
          <tr>
            <th className="px-4 py-3 text-sm font-bold">Seller Name</th>
            <th className="px-4 py-3 text-sm font-bold">Seller Profile</th>
            <th className="px-4 py-3 text-sm font-bold">Product Name</th>
            <th className="px-4 py-3 text-sm font-bold">Price</th>
            <th className="px-4 py-3 text-sm font-bold">Quantity</th>
            <th className="px-4 py-3 text-sm font-bold">Photos</th>
          </tr>
        </thead>
        <tbody>
          {(items || []).length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-4 text-gray">
                No items in this order.
              </td>
            </tr>
          ) : (
            items.map((item, index) => (
              <tr key={`${item.productId || "item"}-${index}`} className="border-t border-white-broken/80">
                <td className="px-4 py-3 text-gray">{item.sellerName || "-"}</td>
                <td className="px-4 py-3 text-gray">
                  {item.sellerProfileUrl ? (
                    <button
                      type="button"
                      className="block"
                      onClick={() =>
                        openPreview(
                          [toAbsoluteUrl(item.sellerProfileUrl)],
                          0,
                          item.sellerName || "Seller profile"
                        )
                      }
                    >
                      <img
                        src={toAbsoluteUrl(item.sellerProfileUrl)}
                        alt={item.sellerName || "Seller profile"}
                        className="h-10 w-10 rounded-full object-cover border border-white-broken"
                      />
                    </button>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-4 py-3 text-gray">{item.name || "-"}</td>
                <td className="px-4 py-3 text-gray">{item.price ?? "-"}</td>
                <td className="px-4 py-3 text-gray">{item.quantity ?? "-"}</td>
                <td className="px-4 py-3 text-gray">
                  {Array.isArray(item.photos) && item.photos.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {item.photos.map((photo, photoIdx) => (
                        <button
                          type="button"
                          key={`${photo}-${photoIdx}`}
                          className="text-green-dark underline-offset-2 hover:underline"
                          onClick={() =>
                            openPreview(
                              (item.photos || []).map((p) => toAbsoluteUrl(p)),
                              photoIdx,
                              `${item.name || "Product"} photo`
                            )
                          }
                        >
                          Photo {photoIdx + 1}
                        </button>
                      ))}
                    </div>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
