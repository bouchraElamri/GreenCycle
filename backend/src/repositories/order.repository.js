const Order = require("../models/order.model");
const client = require("../models/client.model");
require("../models/user.model");

const create = async (orderData) => {
  return Order.create(orderData);
};

const findById = async (id) => {
  return Order.findById(id);
};

const findAll = async () => {
  return Order.find();
};

const getClientId = async (clientId) => {
  return client.find({ clientId: clientId })
    .sort({ createdAt: -1 })
    .populate("items.product", "name price")
    .lean();
};

const findMyOrders = async (clientId) => {
  return Order.find({ clientId: clientId })
    .sort({ createdAt: -1 })
    .populate("items.product", "name price")
    .lean();
};

const findByIdAndUser = (orderId, userId) =>
  Order.findOne({ _id: orderId, user: userId })
    .populate("items.product", "name price")
    .lean();

const findBySellerUser = (sellerUserId) => {
  return Order.find({ "items.seller": sellerUserId })
    .sort({ createdAt: -1 })
    .populate("items.product", "name price")
    .populate({
      path: "clientId",
      select: "userId",
      populate: {
        path: "userId",
        select: "firstName lastName email phone",
      },
    })
    .lean();
};

const findAdminOrders = async ({ status } = {}) => {
  const filter = {};
  if (status) {
    filter.status = status;
  }

  return Order.find(filter).sort({ createdAt: -1 }).lean();
};

const findAdminOrderDetailsById = async (orderId) => {
  return Order.findById(orderId)
    .populate({
      path: "clientId",
      select: "userId",
    })
    .populate({
      path: "items.product",
      select: "name images price",
    })
    .populate({
      path: "items.seller",
      select: "userId",
    })
    .lean();
};

module.exports = {
  create,
  findAll,
  findById,
  findMyOrders,
  findByIdAndUser,
  findBySellerUser,
  getClientId,
  findAdminOrders,
  findAdminOrderDetailsById,
};
