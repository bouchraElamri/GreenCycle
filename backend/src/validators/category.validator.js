const Joi = require("joi");

const createCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  description: Joi.string().trim().allow("").max(500).optional(),
});

const updateCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),
  description: Joi.string().trim().allow("").max(500).optional(),
}).min(1);

module.exports = {
  createCategorySchema,
  updateCategorySchema,
};
