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

const buildUsersSearchFilter = (q) => {
  if (!q || !q.trim()) return {};
  const regex = new RegExp(q.trim(), "i");
  return {
    $or: [
      { firstName: regex },
      { lastName: regex },
      { email: regex },
      { phone: regex },
    ],
  };
};

const findAllUsers = async ({ page = 1, limit = 10, q = "" } = {}) => {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);
  const skip = (safePage - 1) * safeLimit;

  const filter = buildUsersSearchFilter(q);

  return User.find(filter)
    .select("-password -resetPasswordToken -resetPasswordExpires -activationToken")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(safeLimit);
};

const countUsers = async ({ q = "" } = {}) => {
  const filter = buildUsersSearchFilter(q);
  return User.countDocuments(filter);
};


module.exports = {
  createUser,
  findByEmail,
  findById,
  findByResetToken,
  updateUser,
  findOne,
  findAllUsers,
  countUsers,
};
