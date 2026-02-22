const Product = require("../models/product.model");
const Order = require("../models/order.model");
const Client = require("../models/client.model");

const findClientByUserId = async (userId) => {
  return Client.findOne({ userId });
};

const findProductById = async (productId) => {
  return Product.findById(productId);
};

const hasDeliveredOrderForProduct = async (clientId, productId) => {
  return Order.exists({
    clientId,
    status: "delivered",
    "items.product": productId,
  });
};

const hasClientReviewedProduct = (product, clientId) => {
  return (product.comments || []).some(
    (comment) => String(comment.client) === String(clientId)
  );
};

const addReviewAndUpdateRating = async (product, clientId, rating, text) => {
  product.comments.push({
    client: clientId,
    text: String(text).trim(),
    rating,
  });

  const ratings = product.comments
    .map((comment) => Number(comment.rating))
    .filter(Number.isFinite);

  const count = ratings.length;
  const average = count ? ratings.reduce((sum, value) => sum + value, 0) / count : 0;

  product.rating = {
    average: Number(average.toFixed(2)),
    count,
  };

  await product.save();
  return product;
};

const removeClientReviewAndUpdateRating = async (product, clientId) => {
  product.comments = (product.comments || []).filter(
    (comment) => String(comment.client) !== String(clientId)
  );

  const ratings = product.comments
    .map((comment) => Number(comment.rating))
    .filter(Number.isFinite);

  const count = ratings.length;
  const average = count ? ratings.reduce((sum, value) => sum + value, 0) / count : 0;

  product.rating = {
    average: Number(average.toFixed(2)),
    count,
  };

  await product.save();
  return product;
};

module.exports = {
  findClientByUserId,
  findProductById,
  hasDeliveredOrderForProduct,
  hasClientReviewedProduct,
  addReviewAndUpdateRating,
  removeClientReviewAndUpdateRating,
};
