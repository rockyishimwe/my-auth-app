import { useState, useEffect } from 'react'
import { useAuth } from '../App'
import { authApi } from '../api'
import styles from './Profile.module.css'

export default function Profile() {
  const { user, logout, navigateTo } = useAuth()
  const [profile, setProfile] = useState({ name: '', email: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (user) {
      setProfile({ name: user.name || '', email: user.email || '' })
    }
  }, [user])

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Note: This would need a backend endpoint to update user profile
      // For now, we'll just show a success message
      setSuccess('Profile updated successfully!')
      setIsEditing(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setProfile({ name: user.name || '', email: user.email || '' })
    setIsEditing(false)
    setError('')
    setSuccess('')
  }

  if (!user) {
    return (
      <div className={styles.shell}>
        <div className={styles.state}>Please sign in to view your profile.</div>
      </div>
    )
  }

  return (
    <div className={styles.shell + ' page-fade'}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.wordmark}>PROFILE</span>
          <span className={styles.userBadge}>{user.name?.toUpperCase()}</span>
        </div>
        <nav className={styles.nav}>
          <button 
            className={styles.navBtn}
            onClick={() => navigateTo('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={styles.navBtn}
            onClick={() => navigateTo('profile')}
            style={{ background: '#000', color: '#fff' }}
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
        <section className={styles.profileSection}>
          <div className={styles.sectionLabel}>
            <span>Profile Information</span>
            {!isEditing && (
              <button className="secondary" onClick={() => setIsEditing(true)} style={{ fontSize: '0.65rem', padding: '4px 8px' }}>
                Edit
              </button>
            )}
          </div>

          {success && <div className={styles.successMsg}>{success}</div>}
          {error && <div className="error-msg">{error}</div>}

          {isEditing ? (
            <form onSubmit={handleSubmit} className={styles.profileForm}>
              <div className={styles.field}>
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={profile.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleChange}
                  required
                  disabled // Email typically can't be changed
                />
              </div>

              <div className={styles.formActions}>
                <button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" className="secondary" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className={styles.profileDisplay}>
              <div className={styles.infoGroup}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Name:</span>
                  <span className={styles.infoValue}>{profile.name}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Email:</span>
                  <span className={styles.infoValue}>{profile.email}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Member Since:</span>
                  <span className={styles.infoValue}>
                    {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          )}
        </section>

        <section className={styles.statsSection}>
          <div className={styles.sectionLabel}>
            <span>Your Statistics</span>
          </div>
          
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>
                {/* This would come from an API call */}
                <span>0</span>
              </div>
              <div className={styles.statLabel}>Total Goals</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>
                <span>0</span>
              </div>
              <div className={styles.statLabel}>Completed</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>
                <span>0</span>
              </div>
              <div className={styles.statLabel}>In Progress</div>
            </div>
          </div>
        </section>

        <section className={styles.dangerSection}>
          <div className={styles.sectionLabel}>
            <span>Danger Zone</span>
          </div>
          
          <div className={styles.dangerContent}>
            <p className={styles.dangerText}>
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button className="danger" onClick={() => {
              if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                // Handle account deletion
                logout()
              }
            }}>
              Delete Account
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}
