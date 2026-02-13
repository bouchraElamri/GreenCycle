const express = require('express');

const { authenticate } = require('../middlewares/auth.middleware');
const router = express.Router();
const {validateSwitchToSeller} = require('../validators/seller.validator');
const sellerController = require('../controllers/seller.controller');

// Seller routes placeholder
router.use(authenticate); // protège toutes les routes du vendeur
router.get('/', (req, res) => res.json({ message: 'Seller API root' }));
// Switch to seller
router.post('/switch-to-seller', validateSwitchToSeller, sellerController.switchToSeller);

module.exports = router;