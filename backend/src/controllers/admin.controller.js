const adminService = require("../services/admin.service");

const getDashboard = async (req, res, next) => {
  try {
    const stats = await adminService.getDashboardStats();
    return res.status(200).json(stats);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getDashboard,
};
