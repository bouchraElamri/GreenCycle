const express = require('express');
const router = express.Router();
const { PostOrder } = require("../controllers/order.controller");
const validate = require("../middlewares/validate.middleware"); // <- your existing generic middleware
const { createOrderSchema } = require("../validators/order.validator");


// Client routes placeholder
router.use(authenticate);
// Switch to seller
router.post('/switch-to-seller', validateSwitchToSeller, sellerController.switchToSeller);

// For testing without auth middleware
router.post("/orders", validate(createOrderSchema), PostOrder);

module.exports = router;
