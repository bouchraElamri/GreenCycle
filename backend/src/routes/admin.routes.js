const express = require('express');
const router = express.Router();
const { authenticate , isAdmin} = require("../middlewares/auth.middleware");

// Admin routes placeholder
router.use(authenticate); // protège toutes les routes
router.use(isAdmin);

router.get('/', (req, res) => res.json({ message: 'Admin API root' }));

module.exports = router;
