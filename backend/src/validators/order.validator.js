const Joi = require("joi");

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const createOrderSchema = Joi.object({
  // for testing without auth (later you remove this and use req.userId)
  userId: Joi.string().pattern(objectIdRegex).required(),

  items: Joi.array()
    .items(
      Joi.object({
        product: Joi.string().pattern(objectIdRegex).required(),
        quantity: Joi.number().integer().min(1).required(),
      }).required()
    )
    .min(1)
    .required(),

  deliveryAddress: Joi.string().trim().min(3).required(),
});

const getOrdersQuerySchema = Joi.object({
  userId: Joi.string().pattern(objectIdRegex).required(),
});


module.exports = {
  createOrderSchema,
  getOrdersQuerySchema
};
