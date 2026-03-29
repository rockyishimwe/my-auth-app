const { Schema, model, models } = require('mongoose');

const activitySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      index: true
    },
    type: {
      type: String,
      required: [true, 'Activity type is required'],
      enum: ['goal_created', 'goal_updated', 'goal_deleted', 'progress_updated', 'milestone_completed', 'note_added', 'status_changed', 'goal_completed']
    },
    goalId: {
      type: Schema.Types.ObjectId,
      ref: 'Goal',
      index: true
    },
    meta: {
      type: Schema.Types.Mixed,
      default: {}
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: false
  }
);

// Compound index for efficient queries
activitySchema.index({ user: 1, createdAt: -1 });

module.exports = models.Activity || model('Activity', activitySchema);
