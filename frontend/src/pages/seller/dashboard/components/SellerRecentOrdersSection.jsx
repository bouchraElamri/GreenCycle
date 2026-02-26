import { Link } from "react-router-dom";

export default function SellerRecentOrdersSection({ recentOrders }) {
  return (
    <section className="rounded-2xl bg-white-intense p-5 shadow">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-green-dark">Recent Orders</h3>
        <Link to="/seller/orders" className="text-sm font-bold text-green-medium">
          View all
        </Link>
      </div>

      {recentOrders.length === 0 ? (
        <p className="mt-4 text-gray-600">No seller orders found yet.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-[640px] w-full text-left">
            <thead>
              <tr className="border-b text-sm text-gray-600">
                <th className="py-2">Order</th>
                <th className="py-2">Client</th>
                <th className="py-2">Status</th>
                <th className="py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.orderId} className="border-b last:border-0">
                  <td className="py-3 font-bold text-green-dark">
                    #{String(order.orderId).slice(-6)}
                  </td>
                  <td className="py-3">
                    {order.client?.firstName} {order.client?.lastName}
                  </td>
                  <td className="py-3 capitalize">{order.status || "confirmed"}</td>
                  <td className="py-3">
                    {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
