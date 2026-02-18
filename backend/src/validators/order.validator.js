const Joi = require("joi");

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const createOrderSchema = Joi.object({
  // for testing without auth (later you remove this and use req.userId)


  items: Joi.array()
    .items(
      Joi.object({
        product: Joi.string().pattern(objectIdRegex).required(),
        quantity: Joi.number().integer().min(1).required(),
      }).required()
    )
    .min(1)
    .required(),

  deliveryAddress: {
    street: Joi.string().required(),
    city: Joi.string().required(),
    zip: Joi.string().required(),
    country: Joi.string().required(),
  },
});

const getClientOrdersParamsSchema = Joi.object({
  clientId: Joi.string().pattern(objectIdRegex).required(),
});



module.exports = {
  createOrderSchema,
  getClientOrdersParamsSchema
};
