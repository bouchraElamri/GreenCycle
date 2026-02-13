const orderService = require("../services/order.service");


const PostOrder = async (req, res, next) => {
  try {
    
    //onst userId = req.userId;

    // For testing without auth middleware
    const { userId, items, deliveryAddress } = req.body;

    // Call service layer
    const createdOrder = await orderService.createOrder({
      userId,
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
    const { userId } = req.params; // validated by Joi
    const orders = await orderService.getClientOrders({ userId });
    return res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

const GetSellerOrders = async (req, res, next) => {
  try {
    const { userId } = req.params; // validated by Joi
    const orders = await orderService.getSellerOrders({ userId });
    return res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

module.exports = { PostOrder, GetClientOrders, GetSellerOrders };