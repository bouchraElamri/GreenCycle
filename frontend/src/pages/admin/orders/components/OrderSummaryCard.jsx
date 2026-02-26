export default function OrderSummaryCard({ order, formatDate }) {
  return (
    <div className="mb-5 rounded-2xl border border-white-broken bg-white-intense p-4 sm:p-5">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <p className="text-gray"><strong>Order ID:</strong> {order.orderId}</p>
        <p className="text-gray"><strong>Status:</strong> {order.status || "-"}</p>
        <p className="text-gray"><strong>Total Price:</strong> {order.totalPrice ?? "-"}</p>
        <p className="text-gray"><strong>Date:</strong> {formatDate(order.date)}</p>
        <p className="text-gray"><strong>Client Full Name:</strong> {order.clientFullName || "-"}</p>
      </div>
    </div>
  );
}
