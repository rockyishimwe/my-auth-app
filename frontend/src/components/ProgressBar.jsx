import styles from './ProgressBar.module.css'

export default function ProgressBar({ label, current, target, color = 'blue' }) {
  const percentage = Math.min((current / target) * 100, 100)
  
  const getColorClass = () => {
    const colors = {
      blue: styles.blue,
      green: styles.green,
      purple: styles.purple,
      orange: styles.orange,
    }
    return colors[color] || colors.blue
  }

  return (
    <div className={styles.progressBar}>
      <div className={styles.progressHeader}>
        <span className={styles.progressLabel}>{label}</span>
        <span className={styles.progressText}>
          {current} / {target}
        </span>
      </div>
      <div className={styles.progressTrack}>
        <div 
          className={`${styles.progressFill} ${getColorClass()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className={styles.progressPercentage}>
        {percentage.toFixed(1)}%
      </div>
    </div>
  )
}
