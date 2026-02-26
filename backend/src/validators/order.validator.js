const Joi = require("joi");

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const addToCartSchema = Joi.object({
  product: Joi.string().pattern(objectIdRegex).required(),
  quantity: Joi.number().integer().min(1).required(),
});

const confirmPendingOrdersSchema = Joi.object({
  deliveryAddress: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    zip: Joi.string().required(),
    country: Joi.string().required(),
  }).required(),
  bankAccount: Joi.object({
    holderName: Joi.string().required(),
    cardNumber: Joi.string().required(),
    expirationDate: Joi.string().required(),
    cvv: Joi.string().required(),
  }).required(),
});

const getClientOrdersParamsSchema = Joi.object({
  clientId: Joi.string().pattern(objectIdRegex).required(),
});

const orderIdParamsSchema = Joi.object({
  orderId: Joi.string().pattern(objectIdRegex).required(),
});

const updatePendingOrderQuantitySchema = Joi.object({
  quantity: Joi.number().integer().min(1).required(),
});

module.exports = {
  addToCartSchema,
  confirmPendingOrdersSchema,
  getClientOrdersParamsSchema,
  orderIdParamsSchema,
  updatePendingOrderQuantitySchema,
};
