const express = require('express')
const router = express.Router()
const {
  getGoals,
  getGoal,
  createGoal,
  updateGoal,
  deleteGoal,
  updateProgress,
  updateStatus,
  addMilestone,
  toggleMilestone,
  deleteMilestone,
  addNote,
  deleteNote,
  getStats
} = require('../controllers/goalController')
const { protect } = require('../middleware/authMiddleware')

// All routes are protected
router.use(protect)

// Main CRUD operations
router.get('/', getGoals)
router.post('/', createGoal)
router.get('/stats', getStats)
router.get('/:id', getGoal)
router.put('/:id', updateGoal)
router.delete('/:id', deleteGoal)

// Progress and status
router.put('/:id/progress', updateProgress)
router.put('/:id/status', updateStatus)

// Milestones
router.post('/:id/milestones', addMilestone)
router.put('/:id/milestones/:milestoneId', toggleMilestone)
router.delete('/:id/milestones/:milestoneId', deleteMilestone)

// Notes
router.post('/:id/notes', addNote)
router.delete('/:id/notes/:noteId', deleteNote)

module.exports = router
