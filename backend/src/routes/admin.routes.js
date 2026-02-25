const express = require('express');
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const adminController = require("../controllers/admin.controller");
const authController = require("../controllers/auth.controller"); 
const sellerController = require("../controllers/seller.controller");
const validate = require("../middlewares/validate.middleware");
const {
  createCategorySchema,
  updateCategorySchema,
} = require("../validators/category.validator");
const { getProducts, approveProduct, deleteProduct } = require("../controllers/product.controller");
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
router.get("/dashboard", adminController.getDashboard);

// users 
router.get("/users", authController.getAllUsers);

// categories
router.get("/categories", categoryController.getAllCategories);

router.post(
  "/categories",
  validate(createCategorySchema),
  categoryController.createCategory
);

router.patch("/categories/:id",validate(updateCategorySchema),categoryController.updateCategory);

router.delete("/categories/:id", categoryController.deleteCategory);

router.get('/getProducts', getProducts);
router.patch('/products/approve/:id', approveProduct);
router.delete('/products/:id', deleteProduct);
router.get("/orders", GetAdminOrders);
router.get("/orders/delivered", GetAdminDeliveredOrders);
router.get("/orders/confirmed", GetAdminConfirmedOrders);
router.get("/orders/:id", GetAdminOrderDetails);

router.get("/sellers", sellerController.getAllSellersForAdmin);

module.exports = router;
