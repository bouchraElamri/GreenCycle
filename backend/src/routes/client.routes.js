const express = require('express');
const router = express.Router();
const {
  AddToCart,
  ConfirmPendingOrders,
  GetPendingOrders,
  GetConfirmedOrders,
  DeletePendingOrder,
  GetClientOrders,
} = require("../controllers/order.controller");
const validate = require("../middlewares/validate.middleware"); // <- your existing generic middleware
const {
  addToCartSchema,
  confirmPendingOrdersSchema,
  getClientOrdersParamsSchema,
  orderIdParamsSchema,
} = require("../validators/order.validator");
const { authenticate } = require("../middlewares/auth.middleware");
const { validateSwitchToSeller } = require("../validators/seller.validator");
const sellerController = require("../controllers/seller.controller");

router.use(authenticate);

// Client routes placeholder

router.get('/', (req, res) => res.json({ message: 'Client API root' }));

// Switch to seller
router.post('/switch-to-seller', validateSwitchToSeller, sellerController.switchToSeller);

router.post("/add-to-cart", validate(addToCartSchema), AddToCart);

router.post(
  "/orders/confirm",
  validate(confirmPendingOrdersSchema),
  ConfirmPendingOrders
);

router.get("/orders/pending", GetPendingOrders);
router.get("/orders/confirmed", GetConfirmedOrders);
router.delete(
  "/orders/pending/:orderId",
  validate(orderIdParamsSchema, "params"),
  DeletePendingOrder
);

router.get("/orders/:clientId", validate(getClientOrdersParamsSchema, "params"), GetClientOrders);


module.exports = router;
