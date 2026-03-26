const Joi = require('joi');

const goalValidation = Joi.object({
  title: Joi.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must not exceed 100 characters')
    .required()
    .trim()
    .messages({
      'string.empty': 'Title is required',
      'string.min': 'Title must be at least 3 characters',
      'string.max': 'Title must not exceed 100 characters'
    }),
    
  description: Joi.string()
    .max(500, 'Description must not exceed 500 characters')
    .optional()
    .allow('')
    .trim()
    .messages({
      'string.max': 'Description must not exceed 500 characters'
    }),
    
  context: Joi.string()
    .valid('work', 'health', 'finance', 'education', 'personal', 'relationships', 'creativity', 'travel')
    .required()
    .messages({
      'any.only': 'Context must be one of: work, health, finance, education, personal, relationships, creativity, travel'
    }),
    
  priority: Joi.string()
    .valid('low', 'medium', 'high', 'critical')
    .required()
    .messages({
      'any.only': 'Priority must be one of: low, medium, high, critical'
    }),
    
  status: Joi.string()
    .valid('active', 'in-progress', 'completed', 'archived')
    .optional()
    .messages({
      'any.only': 'Status must be one of: active, in-progress, completed, archived'
    }),
    
  progress: Joi.number()
    .min(0, 'Progress must be at least 0')
    .max(100, 'Progress must not exceed 100')
    .optional()
    .messages({
      'number.min': 'Progress must be at least 0',
      'number.max': 'Progress must not exceed 100'
    }),
    
  dueDate: Joi.date()
    .optional()
    .messages({
      'date.base': 'Due date must be a valid date'
    }),
    
  tags: Joi.array()
    .items(
      Joi.string()
        .min(1, 'Each tag must be at least 1 character')
        .max(50, 'Each tag must not exceed 50 characters')
        .trim()
    )
    .max(10, 'Maximum 10 tags allowed')
    .optional()
    .messages({
      'array.max': 'Maximum 10 tags allowed'
    }),
    
  milestones: Joi.array()
    .items(
      Joi.object({
        text: Joi.string()
          .min(1, 'Milestone text is required')
          .max(200, 'Milestone text must not exceed 200 characters')
          .required()
          .trim()
          .messages({
            'string.empty': 'Milestone text is required',
            'string.min': 'Milestone text must be at least 1 character',
            'string.max': 'Milestone text must not exceed 200 characters'
          }),
        completed: Joi.boolean()
          .default(false)
      })
    )
    .max(20, 'Maximum 20 milestones allowed')
    .optional()
    .messages({
      'array.max': 'Maximum 20 milestones allowed'
    })
});

module.exports = goalValidation;
