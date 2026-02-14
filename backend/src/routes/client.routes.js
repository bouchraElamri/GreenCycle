const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth.middleware');
const {validateSwitchToSeller} = require('../validators/seller.validator');
const sellerController = require('../controllers/seller.controller');

// Client routes placeholder
router.use(authenticate);
// Switch to seller
router.post('/switch-to-seller', validateSwitchToSeller, sellerController.switchToSeller);

router.get('/', (req, res) => res.json({ message: 'Client API root' }));6

module.exports = router;
