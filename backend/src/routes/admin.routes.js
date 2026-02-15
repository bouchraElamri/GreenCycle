const express = require('express');
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const authController = require("../controllers/auth.controller"); 
const validate = require("../middlewares/validate.middleware");
const {
  createCategorySchema,
  updateCategorySchema,
} = require("../validators/category.validator");
const { getProducts } = require("../controllers/product.controller");
const {
  GetAdminOrders,
  GetAdminDeliveredOrders,
  GetAdminConfirmedOrders,
  GetAdminOrderDetails,
} = require("../controllers/order.controller");
const { authenticate , isAdmin} = require("../middlewares/auth.middleware");

// Admin routes placeholder
router.use(authenticate); // protège toutes les routes
router.use(isAdmin);

router.get('/', (req, res) => res.json({ message: 'Admin API root' }));

// users 
router.get("/users", authController.getAllUsers);

// categories
router.post(
  "/categories",
  validate(createCategorySchema),
  categoryController.createCategory
);

router.patch("/categories/:id",validate(updateCategorySchema),categoryController.updateCategory);

router.delete("/categories/:id", categoryController.deleteCategory);

router.get('/getProducts', getProducts);
router.get("/orders", GetAdminOrders);
router.get("/orders/delivered", GetAdminDeliveredOrders);
router.get("/orders/confirmed", GetAdminConfirmedOrders);
router.get("/orders/:id", GetAdminOrderDetails);

module.exports = router;
