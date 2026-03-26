const { Schema, model, models } = require('mongoose');

const activitySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    type: {
      type: String,
      required: [true, 'Activity type is required'],
      enum: ['goal_created', 'goal_updated', 'goal_deleted', 'progress_updated', 'milestone_completed', 'note_added', 'status_changed', 'goal_completed']
    },
    goalId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Goal'
    },
    meta: {
      type: Schema.Types.Mixed,
      default: {}
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = models.Activity || model('Activity', activitySchema);
