import { useState } from 'react'
import { useAuth } from '../App'
import styles from './Settings.module.css'

export default function Settings() {
  const { user, logout } = useAuth()
  const [settings, setSettings] = useState({
    theme: 'light',
    notifications: true,
    emailUpdates: false,
    autoSave: true,
    fontSize: 'medium',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (setting, value) => {
    setSettings({ ...settings, [setting]: value })
  }

  const handleSave = async () => {
    setLoading(true)
    setMessage('')
    
    try {
      // Simulate saving settings
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage('Settings saved successfully!')
    } catch (error) {
      setMessage('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSettings({
      theme: 'light',
      notifications: true,
      emailUpdates: false,
      autoSave: true,
      fontSize: 'medium',
    })
    setMessage('Settings reset to defaults')
  }

  return (
    <div className={styles.shell + ' page-fade'}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.wordmark}>SETTINGS</span>
          <span className={styles.userBadge}>{user?.name?.toUpperCase()}</span>
        </div>
        <button className="secondary" onClick={logout} style={{ fontSize: '0.7rem', padding: '6px 14px' }}>
          Sign Out
        </button>
      </header>

      <main className={styles.main}>
        {message && (
          <div className={`${styles.message} ${message.includes('success') ? styles.success : styles.error}`}>
            {message}
          </div>
        )}

        <section className={styles.section}>
          <div className={styles.sectionLabel}>
            <span>Appearance</span>
          </div>
          
          <div className={styles.settingsGroup}>
            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <label htmlFor="theme" className={styles.settingLabel}>Theme</label>
                <p className={styles.settingDescription}>
                  Choose your preferred color theme
                </p>
              </div>
              <select 
                id="theme"
                value={settings.theme}
                onChange={(e) => handleChange('theme', e.target.value)}
                className={styles.select}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <label htmlFor="fontSize" className={styles.settingLabel}>Font Size</label>
                <p className={styles.settingDescription}>
                  Adjust the text size throughout the application
                </p>
              </div>
              <select 
                id="fontSize"
                value={settings.fontSize}
                onChange={(e) => handleChange('fontSize', e.target.value)}
                className={styles.select}
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionLabel}>
            <span>Notifications</span>
          </div>
          
          <div className={styles.settingsGroup}>
            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <label htmlFor="notifications" className={styles.settingLabel}>Push Notifications</label>
                <p className={styles.settingDescription}>
                  Receive notifications about your goals
                </p>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  id="notifications"
                  checked={settings.notifications}
                  onChange={(e) => handleChange('notifications', e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <label htmlFor="emailUpdates" className={styles.settingLabel}>Email Updates</label>
                <p className={styles.settingDescription}>
                  Get weekly progress reports via email
                </p>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  id="emailUpdates"
                  checked={settings.emailUpdates}
                  onChange={(e) => handleChange('emailUpdates', e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionLabel}>
            <span>Application</span>
          </div>
          
          <div className={styles.settingsGroup}>
            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <label htmlFor="autoSave" className={styles.settingLabel}>Auto-Save</label>
                <p className={styles.settingDescription}>
                  Automatically save changes to your goals
                </p>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  id="autoSave"
                  checked={settings.autoSave}
                  onChange={(e) => handleChange('autoSave', e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionLabel}>
            <span>Account</span>
          </div>
          
          <div className={styles.settingsGroup}>
            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <span className={styles.settingLabel}>Export Data</span>
                <p className={styles.settingDescription}>
                  Download all your goals and data
                </p>
              </div>
              <button className="secondary" onClick={() => setMessage('Export feature coming soon!')}>
                Export
              </button>
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <span className={styles.settingLabel}>Clear Cache</span>
                <p className={styles.settingDescription}>
                  Clear locally stored data
                </p>
              </div>
              <button className="secondary" onClick={() => {
                localStorage.clear()
                setMessage('Cache cleared successfully!')
              }}>
                Clear
              </button>
            </div>
          </div>
        </section>

        <section className={styles.actions}>
          <div className={styles.actionButtons}>
            <button 
              onClick={handleSave} 
              disabled={loading}
              className={styles.primaryBtn}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button 
              onClick={handleReset}
              className="secondary"
            >
              Reset to Defaults
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}
