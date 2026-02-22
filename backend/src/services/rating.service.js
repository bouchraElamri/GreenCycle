const ratingRepo = require("../repositories/rating.repository");
const { default: mongoose } = require("mongoose");

const addProductReview = async ({ productId, userId, rating, text }) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    const err = new Error("Invalid product id");
    err.statusCode = 400;
    throw err;
  }

  const normalizedRating = Number(rating);
  if (!Number.isFinite(normalizedRating) || normalizedRating < 1 || normalizedRating > 5) {
    const err = new Error("Rating must be a number between 1 and 5");
    err.statusCode = 400;
    throw err;
  }

  if (!text || !String(text).trim()) {
    const err = new Error("Comment text is required");
    err.statusCode = 400;
    throw err;
  }

  const client = await ratingRepo.findClientByUserId(userId);
  if (!client) {
    const err = new Error("Client profile not found");
    err.statusCode = 404;
    throw err;
  }

  const product = await ratingRepo.findProductById(productId);
  if (!product) {
    const err = new Error("Product not found");
    err.statusCode = 404;
    throw err;
  }

  const deliveredOrderExists = await ratingRepo.hasDeliveredOrderForProduct(
    client._id,
    product._id
  );

  if (!deliveredOrderExists) {
    const err = new Error("You can rate/comment only products from delivered orders");
    err.statusCode = 403;
    throw err;
  }

  const alreadyReviewed = ratingRepo.hasClientReviewedProduct(product, client._id);

  if (alreadyReviewed) {
    const err = new Error("You have already reviewed this product");
    err.statusCode = 409;
    throw err;
  }

  return ratingRepo.addReviewAndUpdateRating(
    product,
    client._id,
    normalizedRating,
    text
  );
};

const removeProductReview = async ({ productId, userId }) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    const err = new Error("Invalid product id");
    err.statusCode = 400;
    throw err;
  }

  const client = await ratingRepo.findClientByUserId(userId);
  if (!client) {
    const err = new Error("Client profile not found");
    err.statusCode = 404;
    throw err;
  }

  const product = await ratingRepo.findProductById(productId);
  if (!product) {
    const err = new Error("Product not found");
    err.statusCode = 404;
    throw err;
  }

  const alreadyReviewed = ratingRepo.hasClientReviewedProduct(product, client._id);
  if (!alreadyReviewed) {
    const err = new Error("You have not reviewed this product");
    err.statusCode = 404;
    throw err;
  }

  return ratingRepo.removeClientReviewAndUpdateRating(product, client._id);
};

module.exports = {
  addProductReview,
  removeProductReview,
};
