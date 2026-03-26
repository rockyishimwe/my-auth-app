/**
 * MongoDB Indexes for Performance
 */

const createIndexes = async () => {
  try {
    const Goal = require('../models/goalModel');
    const Activity = require('../models/activityModel');
    const User = require('../models/userModel');

    // Goal indexes
    await Goal.collection.createIndex({ user: 1, status: 1 });
    await Goal.collection.createIndex({ user: 1, context: 1 });
    await Goal.collection.createIndex({ user: 1, dueDate: 1 });
    await Goal.collection.createIndex({ user: 1, priority: 1 });
    await Goal.collection.createIndex({ 
      title: 'text', 
      description: 'text', 
      tags: 'text' 
    });

    // Activity indexes
    await Activity.collection.createIndex({ user: 1, createdAt: -1 });
    await Activity.collection.createIndex({ user: 1, type: 1 });
    await Activity.collection.createIndex({ user: 1, goalId: 1 });

    // User indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });

    console.log('✅ All database indexes created successfully');
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
  }
};

module.exports = { createIndexes };
