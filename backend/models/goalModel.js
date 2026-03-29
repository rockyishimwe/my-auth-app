const { Schema, model, models } = require('mongoose');

const goalSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      index: true
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
      default: 'personal',
      index: true
    },
    priority: {
      type: String,
      required: [true, 'Priority is required'],
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
      index: true
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: ['active', 'in-progress', 'completed', 'archived'],
      default: 'active',
      index: true
    },
    dueDate: {
      type: Date,
      index: true
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
        _id: {
          type: Schema.Types.ObjectId,
          default: () => new (require('mongoose')).Types.ObjectId()
        },
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
        _id: {
          type: Schema.Types.ObjectId,
          default: () => new (require('mongoose')).Types.ObjectId()
        },
        text: {
          type: String,
          required: true,
          trim: true,
          maxlength: 300
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

// Index for sorting and filtering
goalSchema.index({ user: 1, createdAt: -1 });
goalSchema.index({ user: 1, status: 1, dueDate: 1 });

// Pre-save middleware: process tags and manage completedAt
goalSchema.pre('save', function(next) {
  // Process tags: lowercase, trim, and deduplicate
  if (this.tags && Array.isArray(this.tags)) {
    this.tags = [...new Set(this.tags.map(tag => tag.toLowerCase().trim()))];
  }

  // Auto-set completedAt when status changes to "completed"
  if (this.isModified('status')) {
    if (this.status === 'completed' && !this.completedAt) {
      this.completedAt = new Date();
    } else if (this.status !== 'completed' && this.completedAt) {
      this.completedAt = undefined;
    }
  }

  // Ensure updatedAt is set
  if (this.isModified()) {
    this.updatedAt = new Date();
  }

  next();
});

module.exports = models.Goal || model('Goal', goalSchema);
