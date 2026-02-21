const userRepo = require("../repositories/user.repository");
const productRepo = require("../repositories/product.repository");
const orderRepo = require("../repositories/order.repository");

const getDashboardStats = async () => {
  const [
    usersRegistered,
    productsInSelling,
    productsOnHold,
    totalOrders,
    totalConfirmedOrders,
    totalDeliveredOrders,
  ] = await Promise.all([
    userRepo.countUsers({}),
    productRepo.countByFilter({ isApproved: true }),
    productRepo.countByFilter({ isApproved: false }),
    orderRepo.countByFilter({}),
    orderRepo.countByFilter({ status: "confirmed" }),
    orderRepo.countByFilter({ status: "delivered" }),
  ]);

  return {
    usersRegistered,
    productsInSelling,
    productsOnHold,
    totalOrders,
    totalConfirmedOrders,
    totalDeliveredOrders,
  };
};

module.exports = {
  getDashboardStats,
};
