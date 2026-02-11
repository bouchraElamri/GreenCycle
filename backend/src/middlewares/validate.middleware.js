
const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    error.statusCode = 400;
    return next(error); // on laisse errorHandler gérer
  }

  req.body = value;
  next();
};
module.exports = validate;
