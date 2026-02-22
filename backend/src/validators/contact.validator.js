const Joi = require("joi");

const contactSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().trim().email().required(),
  phone: Joi.string().trim().min(6).max(30).required(),
  message: Joi.string().trim().min(10).max(2000).required(),
});

module.exports = { contactSchema };
