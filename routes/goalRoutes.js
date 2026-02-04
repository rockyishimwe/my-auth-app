const express = require('express')
const router = express.Router()

const {
  getGoals,
  setGoals,
  updateGoals,
  deleteGoals,
} = require('../backend/controllers/goalController')

const {protect } = require('../backend/middleware/authMiddleware');




router.route('/').get(protect, getGoals).post(protect,setGoals)

router.route('/:id').put(protect,updateGoals).delete(protect,deleteGoals)

module.exports = router
