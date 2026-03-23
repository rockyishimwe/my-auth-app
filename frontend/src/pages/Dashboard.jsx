import { useState, useEffect } from 'react'
import { useAuth } from '../App'
import { goalsApi } from '../api'
import GoalItem from '../components/GoalItem'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const { user, logout, navigateTo } = useAuth()
  const [goals, setGoals] = useState([])
  const [newText, setNewText] = useState('')
  const [loadingGoals, setLoadingGoals] = useState(true)
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState('')

  const token = user?.token

  useEffect(() => {
    goalsApi.getAll(token)
      .then(setGoals)
      .catch((e) => setError(e.message))
      .finally(() => setLoadingGoals(false))
  }, [token])

  const addGoal = async (e) => {
    e.preventDefault()
    if (!newText.trim()) return
    setAdding(true)
    setError('')
    try {
      const goal = await goalsApi.create(token, { text: newText.trim() })
      setGoals([goal, ...goals])
      setNewText('')
    } catch (e) {
      setError(e.message)
    } finally {
      setAdding(false)
    }
  }

  const updateGoal = async (id, text) => {
    try {
      const updated = await goalsApi.update(token, id, { text })
      setGoals(goals.map((g) => (g._id === id ? updated : g)))
    } catch (e) {
      setError(e.message)
    }
  }

  const deleteGoal = async (id) => {
    try {
      await goalsApi.remove(token, id)
      setGoals(goals.filter((g) => g._id !== id))
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className={styles.shell + ' page-fade'}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.wordmark}>GOALS</span>
          <span className={styles.userBadge}>{user?.name?.toUpperCase()}</span>
        </div>
        <nav className={styles.nav}>
          <button 
            className={styles.navBtn} 
            onClick={() => navigateTo('dashboard')}
            style={{ background: '#000', color: '#fff' }}
          >
            Dashboard
          </button>
          <button 
            className={styles.navBtn}
            onClick={() => navigateTo('profile')}
          >
            Profile
          </button>
          <button 
            className={styles.navBtn}
            onClick={() => navigateTo('settings')}
          >
            Settings
          </button>
          <button 
            className={styles.navBtn}
            onClick={() => navigateTo('about')}
          >
            About
          </button>
          <button 
            className="secondary" 
            onClick={logout} 
            style={{ fontSize: '0.7rem', padding: '6px 14px' }}
          >
            Sign Out
          </button>
        </nav>
      </header>

      <main className={styles.main}>
        <section className={styles.addSection}>
          <div className={styles.sectionLabel}>
            <span>New Goal</span>
          </div>
          <form onSubmit={addGoal} className={styles.addForm}>
            <input
              type="text"
              placeholder="What do you want to achieve?"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              maxLength={300}
              required
            />
            <button type="submit" disabled={adding}>
              {adding ? 'Adding...' : 'Add'}
            </button>
          </form>
        </section>

        {error && <div className="error-msg" style={{ marginTop: 0 }}>{error}</div>}

        <section className={styles.listSection}>
          <div className={styles.sectionLabel}>
            <span>My Goals</span>
            <span className={styles.count}>{goals.length}</span>
          </div>

          {loadingGoals ? (
            <div className={styles.state}>Loading...</div>
          ) : goals.length === 0 ? (
            <div className={styles.state}>No goals yet. Add one above.</div>
          ) : (
            <div className={styles.list}>
              {goals.map((goal) => (
                <GoalItem
                  key={goal._id}
                  goal={goal}
                  token={token}
                  onUpdate={updateGoal}
                  onDelete={deleteGoal}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
