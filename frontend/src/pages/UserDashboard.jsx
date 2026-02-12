import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { FaPlus, FaTrash, FaEdit, FaCheck } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { checkSession } from '../features/auth/authSlice'
import SecureStorage from '../utils/SecureStorage'

export default function UserDashboard() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const [goals, setGoals] = useState([])
  const [newGoal, setNewGoal] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

   
    dispatch(checkSession())

    
    const userGoals = SecureStorage.getItem(`goals_${user._id}`) || []
    setGoals(userGoals)
  }, [user, navigate, dispatch])

  const addGoal = (e) => {
    e.preventDefault()
    if (!newGoal.trim()) {
      toast.error('Please enter a goal')
      return
    }

    const goal = {
      id: Date.now(),
      text: newGoal,
      createdAt: new Date().toISOString(),
      completed: false
    }

    const updatedGoals = [...goals, goal]
    setGoals(updatedGoals)
    SecureStorage.setItem(`goals_${user._id}`, updatedGoals)
    setNewGoal('')
    toast.success('Goal added successfully!')
  }

  const deleteGoal = (id) => {
    const updatedGoals = goals.filter(goal => goal.id !== id)
    setGoals(updatedGoals)
    SecureStorage.setItem(`goals_${user._id}`, updatedGoals)
    toast.success('Goal deleted!')
  }

  const startEdit = (goal) => {
    setEditingId(goal.id)
    setEditText(goal.text)
  }

  const saveEdit = (id) => {
    const updatedGoals = goals.map(goal =>
      goal.id === id ? { ...goal, text: editText } : goal
    )
    setGoals(updatedGoals)
    SecureStorage.setItem(`goals_${user._id}`, updatedGoals)
    setEditingId(null)
    setEditText('')
    toast.success('Goal updated!')
  }

  const toggleComplete = (id) => {
    const updatedGoals = goals.map(goal =>
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    )
    setGoals(updatedGoals)
    SecureStorage.setItem(`goals_${user._id}`, updatedGoals)
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {user?.name}! </h1>
          <p className="dashboard-subtitle">Manage your goals and track your progress</p>
        </div>
        <button 
          className="btn-settings"
          onClick={() => navigate('/settings')}
        >
          Settings
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"></div>
          <div className="stat-info">
            <h3>{goals.length}</h3>
            <p>Total Goals</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"></div>
          <div className="stat-info">
            <h3>{goals.filter(g => g.completed).length}</h3>
            <p>Completed</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"></div>
          <div className="stat-info">
            <h3>{goals.filter(g => !g.completed).length}</h3>
            <p>In Progress</p>
          </div>
        </div>
      </div>

      <div className="goals-section">
        <h2>Your Goals</h2>
        
        <form onSubmit={addGoal} className="goal-form">
          <input
            type="text"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            placeholder="Enter a new goal..."
            className="goal-input"
          />
          <button type="submit" className="btn-add-goal">
            <FaPlus /> Add Goal
          </button>
        </form>

        <div className="goals-list">
          {goals.length === 0 ? (
            <div className="empty-state">
              <p>No goals yet. Start by adding your first goal!</p>
            </div>
          ) : (
            goals.map((goal) => (
              <div key={goal.id} className={`goal-item ${goal.completed ? 'completed' : ''}`}>
                <div className="goal-content">
                  <input
                    type="checkbox"
                    checked={goal.completed}
                    onChange={() => toggleComplete(goal.id)}
                    className="goal-checkbox"
                  />
                  {editingId === goal.id ? (
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="goal-edit-input"
                      autoFocus
                    />
                  ) : (
                    <span className="goal-text">{goal.text}</span>
                  )}
                </div>
                <div className="goal-actions">
                  {editingId === goal.id ? (
                    <button 
                      onClick={() => saveEdit(goal.id)}
                      className="btn-icon btn-save"
                      title="Save"
                    >
                      <FaCheck />
                    </button>
                  ) : (
                    <button 
                      onClick={() => startEdit(goal)}
                      className="btn-icon btn-edit"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                  )}
                  <button 
                    onClick={() => deleteGoal(goal.id)}
                    className="btn-icon btn-delete"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}