const Joi = require('joi');

const switchToSellerSchema = Joi.object({
    description: Joi.string().min(50).max(1500).required()
    .messages({
        'string.min': 'Description should contain at least a 50 character sentence',
        'string.max': 'Description cannot exceed 1500 characters',
        'any.required': 'Description is required'
    }),
    address: Joi.object({
        street: Joi.string().required().messages({'any.required':'Street address is required'}),
        city: Joi.string().required().messages({'any.required': 'City is required'}),
        zip: Joi.string().required().pattern(/^[0-9]{5}$/).messages({'string.pattern.base': 'Zip code must be 5 digits','any.required': 'Zip code is required'}),
        country: Joi.string().required().messages({'any.required': 'Country is required'})
    }).required().messages({'any.required': 'Address is required'}),
    bankAccount: Joi.object({
        accountHolder: Joi.string().required().messages({'any.required': 'Account holder name is required'}),
        iban: Joi.string().required().pattern(/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/).messages({'string.pattern.base': 'Invalid IBAN format','any.required': 'IBAN is required'}),
        bankName: Joi.string().required().messages({'any.required': 'Bank name is required'})
    }).required().messages({'any.required': 'Bank account is required'})
});

const validateSwitchToSeller = (req, res, next) => {
    const {error} = switchToSellerSchema.validate(req.body, {abortEarly: false, allowUnknown: false});

    if (error){
        const errors = error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
        }));
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
    }
    next();
}

module.exports = { validateSwitchToSeller};
