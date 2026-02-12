// Validation middleware for Joi schemas
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      stripUnknown: true, // Fixed typo: was "stripUnkown"
      abortEarly: false
    })
    
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.details.map(detail => detail.message),
      })
    }
    
    next() // Fixed: moved inside the return function
  }
}

module.exports = validate
