// Validation middleware for Joi schemas
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      stripUnknown: true,
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.details.map(detail => detail.message),
      });
    }

    // Replace req.body with sanitized values
    req.body = value;
    next();
  };
};

module.exports = validate;
