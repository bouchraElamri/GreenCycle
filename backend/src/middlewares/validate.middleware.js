
const validate = (schema, target = "body") => (req, res, next) => {
  const { error, value } = schema.validate(req[target], {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    error.statusCode = 400;
    return next(error); // on laisse errorHandler gérer
  }

  req[target] = value;
  next();
};
module.exports = validate;
