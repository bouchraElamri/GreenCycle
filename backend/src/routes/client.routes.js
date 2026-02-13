const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth.middleware');

// Client routes placeholder
router.use(authenticate);
router.get('/', (req, res) => res.json({ message: 'Client API root' }));

module.exports = router;
