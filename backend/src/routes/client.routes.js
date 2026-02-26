const express = require('express');
const router = express.Router();
const {
  AddToCart,
  ConfirmPendingOrders,
  GetPendingOrders,
  GetConfirmedOrders,
  DeletePendingOrder,
  UpdatePendingOrderQuantity,
  GetClientOrders,
} = require("../controllers/order.controller");
const validate = require("../middlewares/validate.middleware"); // <- your existing generic middleware
const {
  addToCartSchema,
  confirmPendingOrdersSchema,
  getClientOrdersParamsSchema,
  orderIdParamsSchema,
  updatePendingOrderQuantitySchema,
} = require("../validators/order.validator");
const { authenticate } = require("../middlewares/auth.middleware");
const { validateSwitchToSeller } = require("../validators/seller.validator");
const sellerController = require("../controllers/seller.controller");
const { getOrdersQuerySchema } = require("../validators/order.validator");
const uploadProfile = require("../middlewares/uploadProfile.middleware");
const authController = require("../controllers/auth.controller");
const { requestEmailChangeSchema, confirmEmailChangeSchema, changePasswordSchema, emailSchema, resetPasswordSchema, updateProfileSchema } = require("../validators/auth.validator");
const ratingController = require("../controllers/rating.controller");

router.use(authenticate);

// Client routes placeholder

router.get('/', (req, res) => res.json({ message: 'Client API root' }));

// Upload or change profile picture
router.post('/profile/picture', uploadProfile.single('image'), authController.uploadProfilePicture);
router.patch("/profile", validate(updateProfileSchema), authController.updateProfile);

// Switch to seller
router.post('/switch-to-seller', validateSwitchToSeller, sellerController.switchToSeller);

router.post("/add-to-cart", validate(addToCartSchema), AddToCart);

router.post(
  "/orders/confirm",
  validate(confirmPendingOrdersSchema),
  ConfirmPendingOrders
);

router.get("/orders/pending", GetPendingOrders);
router.get("/orders/confirmed", GetConfirmedOrders);
router.patch(
  "/orders/pending/:orderId",
  validate(orderIdParamsSchema, "params"),
  validate(updatePendingOrderQuantitySchema),
  UpdatePendingOrderQuantity
);
router.delete(
  "/orders/pending/:orderId",
  validate(orderIdParamsSchema, "params"),
  DeletePendingOrder
);

router.get("/orders/:clientId", validate(getClientOrdersParamsSchema, "params"), GetClientOrders);
router.post("/products/:id/reviews", ratingController.addProductReview);
router.delete("/products/:id/reviews", ratingController.removeProductReview);
// Change email routes
router.post("/email-change/request", validate(requestEmailChangeSchema), authController.requestEmailChange);
router.post("/email-change/confirm", validate(confirmEmailChangeSchema), authController.confirmEmailChange);

// Change password
router.post("/change-password", validate(changePasswordSchema), authController.changePassword);

// Forgot Password
router.post("/forgot-password", validate(emailSchema), authController.forgotPassword);

// Reset Password
router.post("/reset-password/:token", validate(resetPasswordSchema), authController.resetPassword);

module.exports = router;
