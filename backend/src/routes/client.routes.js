const express = require('express');
const router = express.Router();
const { PostOrder } = require("../controllers/order.controller");
const validate = require("../middlewares/validate.middleware"); // <- your existing generic middleware
const { createOrderSchema } = require("../validators/order.validator");
const { authenticate } = require("../middlewares/auth.middleware");
const { validateSwitchToSeller } = require("../validators/seller.validator");
const sellerController = require("../controllers/seller.controller");
const { getOrdersQuerySchema } = require("../validators/order.validator");
const { GetClientOrders } = require("../controllers/order.controller");
const { getClientOrdersParamsSchema } = require("../validators/order.validator");
const authController = require("../controllers/auth.controller");
const { requestEmailChangeSchema, confirmEmailChangeSchema } = require("../validators/auth.validator");

router.use(authenticate);

// Client routes placeholder

router.get('/', (req, res) => res.json({ message: 'Client API root' }));

// Switch to seller
router.post('/switch-to-seller', validateSwitchToSeller, sellerController.switchToSeller);

// For testing without auth middleware
router.post("/orders/", validate(createOrderSchema), PostOrder);

router.get("/orders/:clientId", validate(getClientOrdersParamsSchema, "params"), GetClientOrders);
// Change email routes
router.post("/email-change/request", validate(requestEmailChangeSchema), authController.requestEmailChange);
router.post("/email-change/confirm", validate(confirmEmailChangeSchema), authController.confirmEmailChange);

module.exports = router;
