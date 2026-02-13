const express = require('express');
const { getProducts, findProductById , filterByPrice , getNewstProducts , productSortedByPrice } = require('../controllers/product.controller');
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { registerSchema, loginSchema, emailSchema, resetPasswordSchema } = require("../validators/auth.validator");
const validate = require("../middlewares/validate.middleware");
const categoryController = require("../controllers/category.controller");

// Public routes placeholder
router.get('/', (req, res) => res.json({ message: 'Public API root' }));
router.get('/getProducts', getProducts);
router.get('/getProductById/:id', findProductById);
router.get('/filterByPrice', filterByPrice);
router.get('/getNewstProducts', getNewstProducts);
router.get('/productSortedByPrice', productSortedByPrice);

router.get('/categories', categoryController.getAllCategories);
router.get('/categories/:id', categoryController.getCategoryById);
router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/forgot-password", validate(emailSchema), authController.forgotPassword);
router.post("/reset-password/:token", validate(resetPasswordSchema), authController.resetPassword);
router.get("/activate/:token", authController.activateAccount);


// Protected
router.get("/verify-token", authenticate, authController.verifyToken);
router.get("/me", authenticate, authController.getCurrentUser);


module.exports = router;




