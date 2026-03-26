const { Schema, model, models } = require('mongoose');

const goalSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      minlength: 3,
      maxlength: 100,
      trim: true
    },
    description: {
      type: String,
      maxlength: 500,
      trim: true
    },
    context: {
      type: String,
      required: [true, 'Context is required'],
      enum: ['work', 'health', 'finance', 'education', 'personal', 'relationships', 'creativity', 'travel'],
      default: 'personal'
    },
    priority: {
      type: String,
      required: [true, 'Priority is required'],
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: ['active', 'in-progress', 'completed', 'archived'],
      default: 'active'
    },
    dueDate: {
      type: Date
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    tags: {
      type: [String],
      validate: {
        validator: function(tags) {
          return tags.length <= 10;
        },
        message: 'Maximum 10 tags allowed'
      }
    },
    milestones: {
      type: [{
        text: {
          type: String,
          required: true,
          trim: true
        },
        completed: {
          type: Boolean,
          default: false
        },
        completedAt: {
          type: Date
        }
      }],
      validate: {
        validator: function(milestones) {
          return milestones.length <= 20;
        },
        message: 'Maximum 20 milestones allowed'
      }
    },
    notes: {
      type: [{
        text: {
          type: String,
          required: true,
          trim: true
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }]
    },
    completedAt: {
      type: Date
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Auto-set completedAt when status changes to "completed"
goalSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'completed' && !this.completedAt) {
    this.completedAt = new Date();
  } else if (this.isModified('status') && this.status !== 'completed' && this.completedAt) {
    this.completedAt = undefined;
  }
  next();
});

module.exports = models.Goal || model('Goal', goalSchema);
