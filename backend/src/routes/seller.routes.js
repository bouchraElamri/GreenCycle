const express = require('express');

const { authenticate } = require('../middlewares/auth.middleware');
const router = express.Router();


// Seller routes placeholder
router.use(authenticate); // protège toutes les routes du vendeur
router.get('/', (req, res) => res.json({ message: 'Seller API root' }));


module.exports = router;