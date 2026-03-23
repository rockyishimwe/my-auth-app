import styles from './StatCard.module.css'

export default function StatCard({ icon, title, value, change, changeType, color }) {
  const getChangeColor = () => {
    if (changeType === 'positive') return '#10b981'
    if (changeType === 'negative') return '#ef4444'
    return '#6b7280'
  }

  const getCardColor = () => {
    const colors = {
      blue: '#3b82f6',
      green: '#10b981',
      purple: '#8b5cf6',
      orange: '#f59e0b'
    }
    return colors[color] || '#3b82f6'
  }

  return (
    <div className={styles.statCard}>
      <div className={styles.statHeader}>
        <div className={styles.statIcon} style={{ backgroundColor: getCardColor() + '20', color: getCardColor() }}>
          <span>{icon}</span>
        </div>
        <div className={styles.statChange} style={{ color: getChangeColor() }}>
          <span className={styles.changeArrow}>
            {changeType === 'positive' ? '↑' : changeType === 'negative' ? '↓' : '→'}
          </span>
          <span className={styles.changeValue}>{change}</span>
        </div>
      </div>
      
      <div className={styles.statContent}>
        <h3 className={styles.statTitle}>{title}</h3>
        <p className={styles.statValue}>{value}</p>
      </div>
    </div>
  )
}
