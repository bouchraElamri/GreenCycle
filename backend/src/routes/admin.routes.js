const express = require('express');
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const validate = require("../middlewares/validate.middleware");
const {
  createCategorySchema,
  updateCategorySchema,
} = require("../validators/category.validator");
const { getProducts } = require("../controllers/product.controller");
const { authenticate , isAdmin} = require("../middlewares/auth.middleware");

// Admin routes placeholder
router.use(authenticate); // protège toutes les routes
router.use(isAdmin);

router.get('/', (req, res) => res.json({ message: 'Admin API root' }));

router.post("/categories",validate(createCategorySchema),categoryController.createCategory);

router.patch("/categories/:id",validate(updateCategorySchema),categoryController.updateCategory);

router.delete("/categories/:id", categoryController.deleteCategory);

router.get('/getProducts', getProducts);

module.exports = router;
