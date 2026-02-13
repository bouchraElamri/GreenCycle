const User = require("../models/user.model");

const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

const findByEmail = async (email) => {
  return await User.findOne({ email });
};

const findById = async (id) => {
  return await User.findById(id);
};

const findByResetToken = async (token) => {
  return await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });
};

const updateUser = async (id, updates) => {
  return await User.findByIdAndUpdate(id, updates, { new: true });
};

const findOne = async (filter) => {
  return await User.findOne(filter);
};

module.exports = {
  createUser,
  findByEmail,
  findById,
  findByResetToken,
  updateUser,
  findOne,
};
