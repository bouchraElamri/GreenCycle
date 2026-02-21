const Seller = require("../models/seller.model");

const createSellerProfile = async (payload) => {
  const seller = new Seller(payload);
  return seller.save();
};

const findByUserId = async (userId) => {
  return Seller.findOne({ userId });
};

const findByUserIdWithUser = async (userId) => {
  return Seller.findOne({ userId }).populate(
    "userId",
    "firstName lastName email phone"
  );
};

const findByIdWithUser = async (id) => {
  return Seller.findById(id).populate("userId", "firstName lastName email phone");
};

const findAllWithUser = async () => {
  return Seller.find()
    .populate("userId", "firstName lastName email")
    .sort({ createdAt: -1 });
};

module.exports = {
  createSellerProfile,
  findByUserId,
  findByUserIdWithUser,
  findByIdWithUser,
  findAllWithUser,
};
