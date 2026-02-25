const orderService = require("../services/order.service");

const AddToCart = async (req, res, next) => {
  try {
    const clientId = req.user.id;
    const { product, quantity } = req.body;

    const createdOrder = await orderService.addToCart({
      userId: clientId,
      productId: product,
      quantity,
    });

    return res.status(201).json({ order: createdOrder });
  } catch (error) {
    next(error);
  }
};

const ConfirmPendingOrders = async (req, res, next) => {
  try {
    const result = await orderService.confirmPendingOrders({
      userId: req.user.id,
      deliveryAddress: req.body.deliveryAddress,
      bankAccount: req.body.bankAccount,
    });

    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const GetPendingOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getPendingOrders({
      userId: req.user.id,
    });
    return res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

const GetConfirmedOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getConfirmedOrders({
      userId: req.user.id,
    });
    return res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

const DeletePendingOrder = async (req, res, next) => {
  try {
    const result = await orderService.deletePendingOrder({
      userId: req.user.id,
      orderId: req.params.orderId,
    });
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const UpdatePendingOrderQuantity = async (req, res, next) => {
  try {
    const order = await orderService.updatePendingOrderQuantity({
      userId: req.user.id,
      orderId: req.params.orderId,
      quantity: req.body.quantity,
    });
    return res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

const GetClientOrders = async (req, res, next) => {
  try {
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

const GetAdminOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getAdminOrders();
    return res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

const GetAdminConfirmedOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getAdminOrders({ status: "confirmed" });
    return res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

const GetAdminDeliveredOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getAdminOrders({ status: "delivered" });
    return res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

const GetAdminOrderDetails = async (req, res, next) => {
  try {
    const order = await orderService.getAdminOrderDetailsById(req.params.id);
    return res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  GetClientOrders,
  GetSellerOrders,
  GetAdminOrders,
  GetAdminConfirmedOrders,
  GetAdminDeliveredOrders,
  GetAdminOrderDetails,
  AddToCart,
  ConfirmPendingOrders,
  GetPendingOrders,
  GetConfirmedOrders,
  DeletePendingOrder,
  UpdatePendingOrderQuantity,
};
