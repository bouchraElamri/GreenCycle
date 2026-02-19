const orderRepo = require('../repositories/order.repository');
const Product = require("../models/product.model");
const mongoose = require("mongoose");
// order.service.js
const Client = require("../models/client.model");
const Order = require("../models/order.model");
const Seller = require("../models/seller.model");

const createOrder = async ({ userId, items, deliveryAddress }) => {

    const client = await Client.findOne({ userId });

    if (!client) {
      const err = new Error("Client profile not found");
      err.statusCode = 404;
      throw err;
    }

    if(!Array.isArray(items) || items.length === 0){
        const error = new Error("Invalid items");
        error.statusCode = 400;
        throw error;
    }

    let totalPrice = 0;
    const orderItems = [];


    for (const item of items) {

        // Fetch real product from DB
        const product = await Product.findById(item.product);

        if (!product) {
            const err = new Error("Product not found");
            err.statusCode = 404;
            throw err;
        }
        if (!item.quantity || item.quantity < 1 || item.quantity > product.quantity) {
            const err = new Error("Invalid quantity for product: " + product.name);
            err.statusCode = 400;
            throw err;
        }

        const subtotal = product.price * item.quantity;
        totalPrice += subtotal;

        orderItems.push({
            product: product._id,
            seller: product.seller,
            name: product.name,
            price: product.price,
            quantity: item.quantity,
        });
    }

    const created = await orderRepo.create({
        clientId: client._id, // this is what Order model expects
        items: orderItems,
        deliveryAddress,
        totalPrice,
        status: "confirmed",
    });

    return created;
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
  createOrder,
  getClientOrders,
  getSellerOrders,
  getAdminOrders,
  getAdminOrderDetailsById,
};
