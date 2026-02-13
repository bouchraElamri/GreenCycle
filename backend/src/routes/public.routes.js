const express = require('express');
const router = express.Router();
const categoryController = require("../controllers/category.controller");
// Public routes placeholder
router.get('/', (req, res) => res.json({ message: 'Public API root' }));
router.get('/categories', categoryController.getAllCategories);
router.get('/categories/:id', categoryController.getCategoryById);
module.exports = router;
