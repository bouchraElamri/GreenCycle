const userRepo = require("../repositories/user.repository");
const productRepo = require("../repositories/product.repository");

const getDashboardStats = async () => {
  const [usersRegistered, productsInSelling, productsOnHold] = await Promise.all([
    userRepo.countUsers({}),
    productRepo.countByFilter({ isApproved: true }),
    productRepo.countByFilter({ isApproved: false }),
  ]);

  return {
    usersRegistered,
    productsInSelling,
    productsOnHold,
  };
};

module.exports = {
  getDashboardStats,
};
