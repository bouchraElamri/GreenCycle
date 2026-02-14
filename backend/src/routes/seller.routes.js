const express = require('express');
const { authenticate } = require('../middlewares/auth.middleware');
const router = express.Router();
const { GetSellerOrders } = require("../controllers/order.controller");

// Seller routes placeholder
router.use(authenticate); // protège toutes les routes du vendeur
router.get('/', (req, res) => res.json({ message: 'Seller API root' }));

router.get("/orders/:sellerId", GetSellerOrders); // use req.user.id inside controller/service


module.exports = router;