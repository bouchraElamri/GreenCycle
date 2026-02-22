const orderRepo = require('../repositories/order.repository');
const Product = require("../models/product.model");
const mongoose = require("mongoose");
// order.service.js
const Client = require("../models/client.model");
const Seller = require("../models/seller.model");

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

const mapAdminOrderSummary = (order) => ({
  orderId: order._id,
  totalPrice: order.totalPrice,
  clientId: order.clientId,
  date: order.createdAt,
  status: order.status,
});

const getAdminOrders = async ({ status } = {}) => {
  const orders = await orderRepo.findAdminOrders({ status });
  return orders.map(mapAdminOrderSummary);
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
    clientId: order.clientId?._id || order.clientId,
    clientUserId: order.clientId?.userId || null,
    totalPrice: order.totalPrice,
    status: order.status,
    date: order.createdAt,
    items: (order.items || []).map((item) => ({
      productId: item.product?._id || item.product,
      sellerId: item.seller?._id || item.seller,
      sellerUserId: item.seller?.userId || null,
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
