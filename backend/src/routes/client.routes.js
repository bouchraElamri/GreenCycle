const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth.middleware');
const {validateSwitchToSeller} = require('../validators/seller.validator');
const sellerController = require('../controllers/seller.controller');

router.use(authenticate);

// Client routes placeholder

router.get('/', (req, res) => res.json({ message: 'Client API root' }));

// Switch to seller
router.post('/switch-to-seller', validateSwitchToSeller, sellerController.switchToSeller);


module.exports = router;
