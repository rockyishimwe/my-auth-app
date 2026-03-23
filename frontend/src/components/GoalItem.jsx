import { useState } from 'react'
import styles from './GoalItem.module.css'

export default function GoalItem({ goal, token, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(goal.text)
  const [loading, setLoading] = useState(false)

  const saveEdit = async () => {
    if (!text.trim() || text === goal.text) { setEditing(false); return }
    setLoading(true)
    await onUpdate(goal._id, text.trim())
    setLoading(false)
    setEditing(false)
  }

  const cancelEdit = () => {
    setText(goal.text)
    setEditing(false)
  }

  const handleDelete = async () => {
    setLoading(true)
    await onDelete(goal._id)
  }

  const date = new Date(goal.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })

  return (
    <div className={styles.item}>
      <div className={styles.meta}>
        <span className={styles.idx}>#{goal._id.slice(-4).toUpperCase()}</span>
        <span className={styles.date}>{date}</span>
      </div>

      {editing ? (
        <div className={styles.editArea}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={2}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveEdit() }
              if (e.key === 'Escape') cancelEdit()
            }}
          />
          <div className={styles.editActions}>
            <button onClick={saveEdit} disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button className="secondary" onClick={cancelEdit}>Cancel</button>
          </div>
        </div>
      ) : (
        <p className={styles.text}>{goal.text}</p>
      )}

      {!editing && (
        <div className={styles.actions}>
          <button className="secondary" onClick={() => setEditing(true)} disabled={loading}>
            Edit
          </button>
          <button className="danger" onClick={handleDelete} disabled={loading}>
            {loading ? '...' : 'Delete'}
          </button>
        </div>
      )}
    </div>
  )
}
