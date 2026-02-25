const express = require('express');
const { getProducts, findProductById  } = require('../controllers/product.controller');
const { isAvailable } = require('../middlewares/availableProduct.middleware');
const router = express.Router();
const authController = require("../controllers/auth.controller");
const sellerController = require("../controllers/seller.controller");
const { authenticate, optionalAuthenticate } = require("../middlewares/auth.middleware");
const { registerSchema, loginSchema, emailSchema, resetPasswordSchema } = require("../validators/auth.validator");
const validate = require("../middlewares/validate.middleware");
const categoryController = require("../controllers/category.controller");
const contactController = require("../controllers/contact.controller");
const { contactSchema } = require("../validators/contact.validator");

// Public routes placeholder
router.get('/', (req, res) => res.json({ message: 'Public API root' }));
router.get('/getProducts', isAvailable, getProducts);
router.get('/getProductById/:id', isAvailable, findProductById);

router.get('/categories', categoryController.getAllCategories);
router.get('/categories/:id', categoryController.getCategoryById);
router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/forgot-password", validate(emailSchema), authController.forgotPassword);
router.get("/activate/:token", authController.activateAccount);
router.post("/contact", validate(contactSchema), contactController.sendContact);


// Protected
router.get("/verify-token", authenticate, authController.verifyToken);
router.get("/me", authenticate, authController.getCurrentUser);
router.get("/sellers/:sellerId", optionalAuthenticate, sellerController.getSellerProfileById);
router.get(
  "/sellers/:sellerId/products",
  sellerController.getSellerProducts
);


module.exports = router;
