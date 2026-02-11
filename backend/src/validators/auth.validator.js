const Joi = require("joi");

// Schema pour l'inscription
const registerSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required().messages({
    "any.required": "Le numéro de téléphone est obligatoire",
  }),

  password: Joi.string().min(6).required(),

  passwordConfirmation: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "Les mots de passe ne correspondent pas",
      "any.required": "La confirmation du mot de passe est obligatoire",
    }),

  role: Joi.string().valid("client", "admin", "seller").required().messages({
    "any.only": "Le rôle doit être 'client', 'admin' ou 'seller'",
  }),

  extraData: Joi.object().optional(),
});


// Schema pour le login
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Schema pour email (forgot password)
const emailSchema = Joi.object({
  email: Joi.string().email().required(),
});

// Schema pour reset password
const resetPasswordSchema = Joi.object({
  password: Joi.string().min(6).required(),
  passwordConfirmation: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "Les mots de passe ne correspondent pas",
      "any.required": "La confirmation du mot de passe est obligatoire",
    }),
});

module.exports = {
  registerSchema,
  loginSchema,
  emailSchema,
  resetPasswordSchema,
};
