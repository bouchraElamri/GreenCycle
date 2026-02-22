const Joi = require("joi");

// Schema pour l'inscription
const registerSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[\d\s-]{9,15}$/).required().messages({
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

const requestEmailChangeSchema = Joi.object({
  newEmail: Joi.string().email().required()
});

const confirmEmailChangeSchema = Joi.object({
  confirmationCode: Joi.string().pattern(/^\d{6}$/).required().messages({
    "string.pattern.base": "Le code de confirmation doit contenir 6 chiffres",
    "any.required": "Le code de confirmation est obligatoire",
  }),
});

const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().min(6).required(),
  newPassword: Joi.string().min(6).required(),
  newPasswordConfirmation: Joi.string().valid(Joi.ref("newPassword")).required().messages({
    "any.only": "Les mots de passe ne correspondent pas",
    "any.required":"La confirmation du mot de pass est obligatoire",
  }),
});

const updateProfileSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  phone: Joi.string().pattern(/^[\d\s-]{9,15}$/).required().messages({
    "any.required": "Le numéro de téléphone est obligatoire",
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
  emailSchema,
  resetPasswordSchema,
  requestEmailChangeSchema,
  confirmEmailChangeSchema,
  changePasswordSchema,
  updateProfileSchema,
};

