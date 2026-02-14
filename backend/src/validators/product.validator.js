const Joi = require("joi");

const productSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      "string.base": "the name must be a string",
      "string.empty": "the name is required",
      "string.min": "the name must contain at least {#limit} characters",
      "string.max": "the name must contain at most {#limit} characters",
      "any.required": "the name is required",
    }),
  description: Joi.string()
    .min(5)
    .max(500)
    .required()
    .messages({
      "string.base": "the description must be a string",
      "string.empty": "the description is required",
      "string.min": "the description must contain at least {#limit} characters",
      "string.max": "the description must contain at most {#limit} characters",
      "any.required": "the description is required",
    }),
  price: Joi.number()
    .positive()
    .required()
    .messages({
      "number.base": "the price must be a number",
      "number.positive": "the price must be positive",
      "any.required": "the price is required",
    }),
  category: Joi.string()
    .required()
    .messages({
      "string.base": "the category must be a string",
      "string.empty": "the category is required",
      "any.required": "the category is required",
    }),
  quantity: Joi.number()
    .positive()
    .required()
    .messages({
      "number.base": "the quantity must be a number",
      "number.positive": "the quantity must be positive",
      "any.required": "the quantity is required",
    }),
});

module.exports = { productSchema };
