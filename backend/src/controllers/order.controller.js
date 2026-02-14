const orderService = require("../services/order.service");
const { authenticate } = require("../middlewares/auth.middleware");


const PostOrder = async (req, res, next) => {
  try {

    const clientId = req.user.id;
    // For testing without auth middleware
    const { items, deliveryAddress } = req.body;

    // Call service layer
    const createdOrder = await orderService.createOrder({
      userId: clientId,
      items,
      deliveryAddress,
    });

    // Return created order
    return res.status(201).json({ order: createdOrder });

  } catch (error) {
    next(error);
  }
};

const GetClientOrders = async (req, res, next) => {
  try {
    const { clientId } = req.params; // validated by Joi
    const orders = await orderService.getClientOrders({
      authUserId: req.user.id,
      clientId: req.params.clientId,
  });
    return res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

const GetSellerOrders = async (req, res, next) => {
  try {
    const { sellerId } = req.params; // validated by Joi
    const orders = await orderService.getSellerOrders({
      authUserId: req.user.id,
      sellerId: req.params.sellerId,
  });
    return res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

module.exports = { PostOrder, GetClientOrders, GetSellerOrders };