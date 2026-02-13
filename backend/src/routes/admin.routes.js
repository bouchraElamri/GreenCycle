const express = require('express');
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const validate = require("../middlewares/validate.middleware");
const {
  createCategorySchema,
  updateCategorySchema,
} = require("../validators/category.validator");


// Admin routes placeholder
router.get('/', (req, res) => res.json({ message: 'Admin API root' }));

router.post(
  "/categories",
  validate(createCategorySchema),
  categoryController.createCategory
);

router.patch(
  "/categories/:id",
  validate(updateCategorySchema),
  categoryController.updateCategory
);

router.delete("/categories/:id", categoryController.deleteCategory);

module.exports = router;
