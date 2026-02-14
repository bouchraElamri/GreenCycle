const Order = require("../models/order.model");
const client = require("../models/client.model");
require("../models/user.model");

const create=async (orderData) => {
    return Order.create(orderData);
};

const findById=async (id) => {
    return Order.findById(id);
};

const findAll=async () => {
    return Order.find();
};

const getClientId = async(clientId) => {
  return client.find({ clientId: clientId })
    .sort({ createdAt: -1 })
    .populate("items.product", "name price")
    .lean();
}

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



// Seller: orders that include items sold by this seller
const findBySellerUser = (sellerUserId) => {
  return Order.find({ "items.seller": sellerUserId })
    .sort({ createdAt: -1 })
    .populate("items.product", "name price")
    .populate("clientId.userId", "firstName lastName email phone")
    .lean();
};



module.exports = {
  create,
  findAll,
  findById,
  findMyOrders,
  findByIdAndUser,
  findBySellerUser,
  getClientId
};