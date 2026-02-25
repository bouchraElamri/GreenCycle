const orderRepo = require('../repositories/order.repository');
const Product = require("../models/product.model");
const mongoose = require("mongoose");
// order.service.js
const Client = require("../models/client.model");
const Seller = require("../models/seller.model");
const User = require("../models/user.model");
const sendEmail = require("../utils/email");

const formatMoney = (value) => Number(value || 0).toFixed(2);
const fullName = (user = {}) => `${user.firstName || ""} ${user.lastName || ""}`.trim();

const addToCart = async ({ userId, productId, quantity }) => {
  const client = await Client.findOne({ userId });
  if (!client) {
    const err = new Error("Client profile not found");
    err.statusCode = 404;
    throw err;
  }

  const product = await Product.findById(productId);
  if (!product) {
    const err = new Error("Product not found");
    err.statusCode = 404;
    throw err;
  }

  if (!quantity || quantity < 1 || quantity > product.quantity) {
    const err = new Error("Invalid quantity for product: " + product.name);
    err.statusCode = 400;
    throw err;
  }

  const created = await orderRepo.create({
    clientId: client._id,
    items: [
      {
        product: product._id,
        seller: product.seller,
        name: product.name,
        price: product.price,
        quantity,
      },
    ],
    totalPrice: product.price * quantity,
    status: "pending",
  });

  return created;
};

const confirmPendingOrders = async ({ userId, deliveryAddress, bankAccount }) => {
  const client = await Client.findOne({ userId });
  if (!client) {
    const err = new Error("Client profile not found");
    err.statusCode = 404;
    throw err;
  }

  const pendingOrders = await orderRepo.findPendingByClient(client._id);
  if (!pendingOrders.length) {
    const err = new Error("No pending orders to confirm");
    err.statusCode = 400;
    throw err;
  }

  const mergedByProduct = new Map();
  for (const order of pendingOrders) {
    for (const item of order.items || []) {
      const key = String(item.product);
      const current = mergedByProduct.get(key);
      if (current) {
        current.quantity += item.quantity;
      } else {
        mergedByProduct.set(key, {
          product: item.product,
          seller: item.seller,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        });
      }
    }
  }

  const items = Array.from(mergedByProduct.values());
  const totalPrice = items.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  const confirmedOrder = await orderRepo.create({
    clientId: client._id,
    items,
    deliveryAddress,
    bankAccount,
    totalPrice,
    status: "confirmed",
  });

  await orderRepo.deleteManyByIds(pendingOrders.map((order) => order._id));

  // Send confirmation email to client
  const clientUser = await User.findById(client.userId)
    .select("firstName lastName email")
    .lean();

  if (clientUser?.email) {
    const clientLines = [
      `Hello ${fullName(clientUser) || "Client"},`,
      "",
      "Your order has been confirmed.",
      "",
      `Order ID: ${confirmedOrder._id}`,
      `Products chosen: ${items.length}`,
      `Number of items: ${items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)}`,
      `Total price: ${formatMoney(totalPrice)} DH`,
      `Delivery address: ${deliveryAddress?.street || "-"}, ${deliveryAddress?.city || "-"}, ${deliveryAddress?.zip || "-"}, ${deliveryAddress?.country || "-"}`,
      "",
      "Order summary:",
      ...items.map(
        (item) =>
          `- ${item.name || "Product"} | qty: ${item.quantity} | unit: ${formatMoney(item.price)} DH | subtotal: ${formatMoney(Number(item.price || 0) * Number(item.quantity || 0))} DH`
      ),
      "",
      "Thank you for your purchase.",
    ];

    await sendEmail(
      clientUser.email,
      "Your order has been confirmed",
      clientLines.join("\n")
    ).catch(() => null);
  }

  // Send product purchase email to each seller in the confirmed order
  const sellerIds = Array.from(new Set(items.map((item) => String(item.seller))));
  const sellers = await Seller.find({ _id: { $in: sellerIds } })
    .populate("userId", "firstName lastName email")
    .lean();

  const sellersById = new Map(sellers.map((seller) => [String(seller._id), seller]));
  const sellerEmailTasks = [];

  for (const sellerId of sellerIds) {
    const seller = sellersById.get(String(sellerId));
    const sellerUser = seller?.userId || {};
    if (!sellerUser.email) continue;

    const sellerItems = items.filter((item) => String(item.seller) === String(sellerId));
    const sellerTotal = sellerItems.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
      0
    );

    const sellerLines = [
      `Hello ${fullName(sellerUser) || "Seller"},`,
      "",
      "One or more of your products has been purchased.",
      "",
      `Order ID: ${confirmedOrder._id}`,
      `Customer: ${fullName(clientUser) || "-"}`,
      `Status: confirmed`,
      `Your total in this order: ${formatMoney(sellerTotal)} DH`,
      "",
      "Purchased products:",
      ...sellerItems.map(
        (item) =>
          `- ${item.name || "Product"} | qty: ${item.quantity} | unit: ${formatMoney(item.price)} DH | subtotal: ${formatMoney(Number(item.price || 0) * Number(item.quantity || 0))} DH`
      ),
    ];

    sellerEmailTasks.push(
      sendEmail(
        sellerUser.email,
        "Your product has been purchased",
        sellerLines.join("\n")
      )
    );
  }

  if (sellerEmailTasks.length > 0) {
    await Promise.allSettled(sellerEmailTasks);
  }

  return {
    order: confirmedOrder,
    mergedOrdersCount: pendingOrders.length,
  };
};

const getPendingOrders = async ({ userId }) => {
  const client = await Client.findOne({ userId });
  if (!client) {
    const err = new Error("Client profile not found");
    err.statusCode = 404;
    throw err;
  }

  const orders = await orderRepo.findByClientAndStatus(client._id, "pending");
  return orders.map((order) => {
    const firstItem = (order.items || [])[0] || {};
    const product = firstItem.product || {};

    return {
      orderId: order._id,
      status: order.status,
      quantity: firstItem.quantity || 0,
      product: {
        id: product._id || firstItem.product,
        name: firstItem.name || product.name,
        price: firstItem.price || product.price,
        image: Array.isArray(product.images) ? product.images[0] : undefined,
      },
      totalPrice: order.totalPrice,
      createdAt: order.createdAt,
    };
  });
};

const getConfirmedOrders = async ({ userId }) => {
  const client = await Client.findOne({ userId });
  if (!client) {
    const err = new Error("Client profile not found");
    err.statusCode = 404;
    throw err;
  }

  return orderRepo.findByClientAndStatus(client._id, "confirmed");
};

const deletePendingOrder = async ({ userId, orderId }) => {
  const client = await Client.findOne({ userId });
  if (!client) {
    const err = new Error("Client profile not found");
    err.statusCode = 404;
    throw err;
  }

  const pendingOrder = await orderRepo.findPendingByIdAndClient(orderId, client._id);
  if (!pendingOrder) {
    const err = new Error("Pending order not found");
    err.statusCode = 404;
    throw err;
  }

  await orderRepo.deleteById(orderId);
  return { message: "Pending order deleted successfully" };
};

const getClientOrders = async ({ authUserId, clientId }) => {
  const client = await Client.findOne({ _id: clientId, userId: authUserId });
  if (!client) {
    const err = new Error("Forbidden");
    err.statusCode = 403;
    throw err;
  }

  return orderRepo.findMyOrders(client._id);
};

const getSellerOrders = async ({ authUserId, sellerId }) => {
  const sellerQuery = sellerId
    ? { _id: sellerId, userId: authUserId }
    : { userId: authUserId };

  const seller = await Seller.findOne(sellerQuery);
  if (!seller) {
    const err = new Error("Seller profile not found");
    err.statusCode = 404;
    throw err;
  }

  const orders = await orderRepo.findBySellerUser(seller._id);

  return orders
    .map((order) => {
      const sellerItems = (order.items || []).filter(
        (item) => String(item.seller) === String(seller._id)
      );

      if (sellerItems.length === 0) {
        return null;
      }

      const user = order.clientId?.userId || {};

      return {
        orderId: order._id,
        items: sellerItems.map((item) => ({
          productName: item.name || item.product?.name,
          quantity: item.quantity,
        })),
        client: {
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          email: user.email,
        },
        status: order.status,
        orderDate: order.createdAt,
      };
    })
    .filter(Boolean);
};

const getFullName = (user = {}) =>
  `${user?.firstName || ""} ${user?.lastName || ""}`.trim();

const mapAdminOrderSummary = (order) => ({
  orderId: order._id,
  totalPrice: order.totalPrice,
  clientFullName: getFullName(order.clientId?.userId) || "-",
  date: order.createdAt,
  status: order.status,
});

const getAdminOrders = async ({ status } = {}) => {
  const orders = await orderRepo.findAdminOrders({ status });
  const visibleOrders = status
    ? orders
    : orders.filter((order) =>
        ["confirmed", "delivered"].includes(String(order?.status || "").toLowerCase())
      );

  return visibleOrders.map(mapAdminOrderSummary);
};

const getAdminOrderDetailsById = async (orderId) => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    const err = new Error("Invalid order id");
    err.statusCode = 400;
    throw err;
  }

  const order = await orderRepo.findAdminOrderDetailsById(orderId);
  if (!order) {
    const err = new Error("Order not found");
    err.statusCode = 404;
    throw err;
  }

  return {
    orderId: order._id,
    clientFullName: getFullName(order.clientId?.userId) || "-",
    totalPrice: order.totalPrice,
    status: order.status,
    date: order.createdAt,
    items: (order.items || []).map((item) => ({
      productId: item.product?._id || item.product,
      sellerName: getFullName(item.seller?.userId) || "-",
      sellerProfileUrl: item.seller?.profileUrl || null,
      name: item.product?.name || item.name,
      price: item.price ?? item.product?.price,
      photos: item.product?.images || [],
      quantity: item.quantity,
    })),
  };
};

if (!getClientOrders || !getSellerOrders) {
  throw new Error("Required order service functions are missing");
}

module.exports = {
  addToCart,
  confirmPendingOrders,
  getPendingOrders,
  getConfirmedOrders,
  deletePendingOrder,
  getClientOrders,
  getSellerOrders,
  getClientOrders,
  getSellerOrders,
  getAdminOrders,
  getAdminOrderDetailsById,
};
