const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
//const homeController = require("../controllers/home.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { registerSchema, loginSchema, emailSchema, resetPasswordSchema } = require("../validators/auth.validator");
const validate = require("../middlewares/validate.middleware");

// Public
router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/forgot-password", validate(emailSchema), authController.forgotPassword);
router.post("/reset-password/:token", validate(resetPasswordSchema), authController.resetPassword);
router.get("/activate/:token", authController.activateAccount);
//router.get("/home", homeController.getHomeProducts);
//router.get("/product-details/:id", homeController.getHomeProductDetails);

// Protected
router.get("/verify-token", authenticate, authController.verifyToken);
router.get("/me", authenticate, authController.getCurrentUser);

module.exports = router;