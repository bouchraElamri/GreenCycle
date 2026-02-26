export default function SellerPerformancePanels({ stats }) {
  const inventoryProgress =
    stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0;
  const orderProgress =
    stats.totalOrders > 0
      ? Math.round((stats.deliveredOrders / stats.totalOrders) * 100)
      : 0;

  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <article className="rounded-2xl bg-white-intense p-5 shadow">
        <h3 className="text-xl font-bold text-green-dark">Inventory Snapshot</h3>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Low stock (1-4 units)</span>
            <span className="font-bold text-green-dark">{stats.lowStock}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Out of stock</span>
            <span className="font-bold text-red-700">{stats.outOfStock}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-green-light">
            <div
              className="h-full bg-green-dark"
              style={{ width: `${inventoryProgress}%` }}
            />
          </div>
          <p className="text-xs text-gray-600">
            Approval rate based on current product list.
          </p>
        </div>
      </article>

      <article className="rounded-2xl bg-white-intense p-5 shadow">
        <h3 className="text-xl font-bold text-green-dark">Order Status</h3>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">All orders</span>
            <span className="font-bold text-green-dark">{stats.totalOrders}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Delivered</span>
            <span className="font-bold text-green-dark">{stats.deliveredOrders}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-green-light">
            <div
              className="h-full bg-green-medium"
              style={{ width: `${orderProgress}%` }}
            />
          </div>
          <p className="text-xs text-gray-600">Delivery completion progress.</p>
        </div>
      </article>
    </section>
  );
}
