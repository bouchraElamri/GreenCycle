const orderService = require("../services/order.service");


const PostOrder = async (req, res, next) => {
  try {
    
    const userId = req.userId;

    // For testing without auth middleware
    const { items, deliveryAddress } = req.body;

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

module.exports = { PostOrder };