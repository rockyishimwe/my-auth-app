const Joi = require('joi');

const createGoalSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(100)
    .required()
    .trim()
    .messages({
      'string.empty': 'Title is required',
      'string.min': 'Title must be at least 3 characters',
      'string.max': 'Title must not exceed 100 characters'
    }),
    
  description: Joi.string()
    .max(500)
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
    
  dueDate: Joi.date()
    .optional()
    .messages({
      'date.base': 'Due date must be a valid date'
    }),
    
  tags: Joi.array()
    .items(
      Joi.string()
        .min(1)
        .max(50)
        .trim()
        .messages({
          'string.min': 'Each tag must be at least 1 character',
          'string.max': 'Each tag must not exceed 50 characters'
        })
    )
    .max(10)
    .optional()
    .messages({
      'array.max': 'Maximum 10 tags allowed'
    }),
    
  milestones: Joi.array()
    .items(
      Joi.object({
        text: Joi.string()
          .min(1)
          .max(200)
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
    .max(20)
    .optional()
    .messages({
      'array.max': 'Maximum 20 milestones allowed'
    })
});

const updateGoalSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(100)
    .optional()
    .trim()
    .messages({
      'string.min': 'Title must be at least 3 characters',
      'string.max': 'Title must not exceed 100 characters'
    }),
    
  description: Joi.string()
    .max(500)
    .optional()
    .allow('')
    .trim()
    .messages({
      'string.max': 'Description must not exceed 500 characters'
    }),
    
  context: Joi.string()
    .valid('work', 'health', 'finance', 'education', 'personal', 'relationships', 'creativity', 'travel')
    .optional()
    .messages({
      'any.only': 'Context must be one of: work, health, finance, education, personal, relationships, creativity, travel'
    }),
    
  priority: Joi.string()
    .valid('low', 'medium', 'high', 'critical')
    .optional()
    .messages({
      'any.only': 'Priority must be one of: low, medium, high, critical'
    }),
    
  status: Joi.string()
    .valid('active', 'in-progress', 'completed', 'archived')
    .optional()
    .messages({
      'any.only': 'Status must be one of: active, in-progress, completed, archived'
    }),
    
  dueDate: Joi.date()
    .optional()
    .messages({
      'date.base': 'Due date must be a valid date'
    }),
    
  tags: Joi.array()
    .items(
      Joi.string()
        .min(1)
        .max(50)
        .trim()
        .messages({
          'string.min': 'Each tag must be at least 1 character',
          'string.max': 'Each tag must not exceed 50 characters'
        })
    )
    .max(10)
    .optional()
    .messages({
      'array.max': 'Maximum 10 tags allowed'
    })
});

const updateProgressSchema = Joi.object({
  progress: Joi.number()
    .min(0)
    .max(100)
    .required()
    .messages({
      'number.min': 'Progress must be at least 0',
      'number.max': 'Progress must not exceed 100',
      'any.required': 'Progress is required'
    })
});

const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid('active', 'in-progress', 'completed', 'archived')
    .required()
    .messages({
      'any.only': 'Status must be one of: active, in-progress, completed, archived',
      'any.required': 'Status is required'
    })
});

const addMilestoneSchema = Joi.object({
  text: Joi.string()
    .min(1)
    .max(200)
    .required()
    .trim()
    .messages({
      'string.empty': 'Milestone text is required',
      'string.min': 'Milestone text must be at least 1 character',
      'string.max': 'Milestone text must not exceed 200 characters',
      'any.required': 'Milestone text is required'
    })
});

const addNoteSchema = Joi.object({
  text: Joi.string()
    .min(1)
    .max(1000)
    .required()
    .trim()
    .messages({
      'string.empty': 'Note text is required',
      'string.min': 'Note text must be at least 1 character',
      'string.max': 'Note text must not exceed 1000 characters',
      'any.required': 'Note text is required'
    })
});

module.exports = {
  createGoalSchema,
  updateGoalSchema,
  updateProgressSchema,
  updateStatusSchema,
  addMilestoneSchema,
  addNoteSchema
};
