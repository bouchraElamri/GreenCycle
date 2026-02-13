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
  return Seller.findById(id).populate("userId", "firstName lastName email");
};

module.exports = {
  createSellerProfile,
  findByUserId,
  findByUserIdWithUser,
  findByIdWithUser,
};
