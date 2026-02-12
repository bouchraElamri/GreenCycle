const express = require('express');
const router = express.Router();
const { PostOrder } = require("../controllers/order.controller");


// Client routes placeholder
router.use(authenticate);
// Switch to seller
router.post('/switch-to-seller', validateSwitchToSeller, sellerController.switchToSeller);

// For testing without auth middleware
router.post("/orders", PostOrder);

module.exports = router;

module.exports = router;
