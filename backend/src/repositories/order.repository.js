const Order = require("../models/order.model");

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
  return Order.find({ user: userId }).sort({ createdAt: -1 });
};


const findByIdAndUser = (orderId, userId) =>
  Order.findOne({ _id: orderId, user: userId })
    .populate("items.product", "name price")
    .lean();

module.exports = {
  create,
  findAll,
  findById,
  findMyOrders,
  findByIdAndUser
};
