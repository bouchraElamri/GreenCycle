const Order = require("../models/order.model");
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

const findMyOrders = async (userId) => {
  return Order.find({ user: userId })
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
    .populate("user")
    .lean();
};



module.exports = {
  create,
  findAll,
  findById,
  findMyOrders,
  findByIdAndUser,
  findBySellerUser
};