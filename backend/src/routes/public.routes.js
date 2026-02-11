const express = require('express');
const router = express.Router();

// Public routes placeholder
router.get('/', (req, res) => res.json({ message: 'Public API root' }));

module.exports = router;
