const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/userModel');
const Goal = require('../models/goalModel');

describe('Goals Routes', () => {
  let token;
  let userId;

  beforeAll(async () => {
    const mongoUri = process.env.MONGO_TEST_URI || 'mongodb://localhost:27017/goalos_test';
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Goal.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Goal.deleteMany({});

    // Create and login a test user
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    await user.save();

    const loginResponse = await request(app)
      .post('/api/users/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    token = loginResponse.body.data.token;
    userId = loginResponse.body.data.user._id;
  });

  describe('POST /api/goals', () => {
    it('should create a new goal successfully', async () => {
      const goalData = {
        title: 'Learn React',
        description: 'Complete React tutorial',
        context: 'education',
        priority: 'medium',
        tags: ['react', 'frontend']
      };

      const response = await request(app)
        .post('/api/goals')
        .set('Authorization', `Bearer ${token}`)
        .send(goalData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(goalData.title);
      expect(response.body.data.user).toBe(userId);
      expect(response.body.data.tags).toEqual(goalData.tags.map(tag => tag.toLowerCase()));
    });

    it('should return error for missing title', async () => {
      const goalData = {
        description: 'Complete React tutorial',
        context: 'education',
        priority: 'medium'
      };

      const response = await request(app)
        .post('/api/goals')
        .set('Authorization', `Bearer ${token}`)
        .send(goalData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return error for title too short', async () => {
      const goalData = {
        title: 'Go',
        context: 'education',
        priority: 'medium'
      };

      const response = await request(app)
        .post('/api/goals')
        .set('Authorization', `Bearer ${token}`)
        .send(goalData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return error for invalid context', async () => {
      const goalData = {
        title: 'Learn React',
        context: 'invalid',
        priority: 'medium'
      };

      const response = await request(app)
        .post('/api/goals')
        .set('Authorization', `Bearer ${token}`)
        .send(goalData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return error without authentication', async () => {
      const goalData = {
        title: 'Learn React',
        context: 'education',
        priority: 'medium'
      };

      const response = await request(app)
        .post('/api/goals')
        .send(goalData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/goals', () => {
    beforeEach(async () => {
      // Create test goals
      await Goal.create([
        {
          title: 'Learn React',
          user: userId,
          context: 'education',
          priority: 'medium',
          status: 'active'
        },
        {
          title: 'Build a website',
          user: userId,
          context: 'work',
          priority: 'high',
          status: 'in-progress'
        }
      ]);
    });

    it('should get all goals for authenticated user', async () => {
      const response = await request(app)
        .get('/api/goals')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.pagination.total).toBe(2);
    });

    it('should filter goals by context', async () => {
      const response = await request(app)
        .get('/api/goals?context=education')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].context).toBe('education');
    });

    it('should filter goals by status', async () => {
      const response = await request(app)
        .get('/api/goals?status=active')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].status).toBe('active');
    });

    it('should return error without authentication', async () => {
      const response = await request(app)
        .get('/api/goals')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/goals/:id', () => {
    let goalId;

    beforeEach(async () => {
      const goal = await Goal.create({
        title: 'Learn React',
        user: userId,
        context: 'education',
        priority: 'medium',
        status: 'active'
      });
      goalId = goal._id;
    });

    it('should update goal successfully', async () => {
      const updateData = {
        title: 'Master React',
        description: 'Become React expert',
        progress: 50
      };

      const response = await request(app)
        .put(`/api/goals/${goalId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updateData.title);
      expect(response.body.data.progress).toBe(updateData.progress);
    });

    it('should return error for non-existent goal', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const updateData = { title: 'Updated Title' };

      const response = await request(app)
        .put(`/api/goals/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it('should return error without authentication', async () => {
      const updateData = { title: 'Updated Title' };

      const response = await request(app)
        .put(`/api/goals/${goalId}`)
        .send(updateData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/goals/:id', () => {
    let goalId;

    beforeEach(async () => {
      const goal = await Goal.create({
        title: 'Learn React',
        user: userId,
        context: 'education',
        priority: 'medium',
        status: 'active'
      });
      goalId = goal._id;
    });

    it('should delete goal successfully', async () => {
      const response = await request(app)
        .delete(`/api/goals/${goalId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(goalId.toString());

      // Verify goal is deleted
      const deletedGoal = await Goal.findById(goalId);
      expect(deletedGoal).toBeNull();
    });

    it('should return error for non-existent goal', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .delete(`/api/goals/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it('should return error without authentication', async () => {
      const response = await request(app)
        .delete(`/api/goals/${goalId}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/goals/:id/progress', () => {
    let goalId;

    beforeEach(async () => {
      const goal = await Goal.create({
        title: 'Learn React',
        user: userId,
        context: 'education',
        priority: 'medium',
        status: 'active',
        progress: 25
      });
      goalId = goal._id;
    });

    it('should update progress successfully', async () => {
      const response = await request(app)
        .put(`/api/goals/${goalId}/progress`)
        .set('Authorization', `Bearer ${token}`)
        .send({ progress: 75 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.progress).toBe(75);
    });

    it('should return error for invalid progress value', async () => {
      const response = await request(app)
        .put(`/api/goals/${goalId}/progress`)
        .set('Authorization', `Bearer ${token}`)
        .send({ progress: 150 })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/goals/:id/status', () => {
    let goalId;

    beforeEach(async () => {
      const goal = await Goal.create({
        title: 'Learn React',
        user: userId,
        context: 'education',
        priority: 'medium',
        status: 'active'
      });
      goalId = goal._id;
    });

    it('should update status successfully', async () => {
      const response = await request(app)
        .put(`/api/goals/${goalId}/status`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'completed' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('completed');
      expect(response.body.data.completedAt).toBeDefined();
    });

    it('should return error for invalid status', async () => {
      const response = await request(app)
        .put(`/api/goals/${goalId}/status`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'invalid' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});
