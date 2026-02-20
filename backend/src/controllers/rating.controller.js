const ratingService = require("../services/rating.service");

const addProductReview = async (req, res, next) => {
  try {
    const { rating, text } = req.body || {};
    const product = await ratingService.addProductReview({
      productId: req.params.id,
      userId: req.user.id,
      rating,
      text,
    });

    return res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

const removeProductReview = async (req, res, next) => {
  try {
    const product = await ratingService.removeProductReview({
      productId: req.params.id,
      userId: req.user.id,
    });

    return res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addProductReview,
  removeProductReview,
};
