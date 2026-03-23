import styles from './TrafficSources.module.css'

export default function TrafficSources() {
  const sources = [
    { name: 'Direct', percentage: 35, color: '#3b82f6' },
    { name: 'Social Media', percentage: 25, color: '#10b981' },
    { name: 'Referral', percentage: 20, color: '#f59e0b' },
    { name: 'Organic Search', percentage: 15, color: '#8b5cf6' },
    { name: 'Email', percentage: 5, color: '#ef4444' },
  ]

  return (
    <div className={styles.trafficSources}>
      <h3 className={styles.title}>Traffic Sources</h3>
      <div className={styles.sourcesList}>
        {sources.map((source, index) => (
          <div key={index} className={styles.sourceItem}>
            <div className={styles.sourceHeader}>
              <div className={styles.sourceInfo}>
                <div 
                  className={styles.sourceDot} 
                  style={{ backgroundColor: source.color }}
                />
                <span className={styles.sourceName}>{source.name}</span>
              </div>
              <span className={styles.sourcePercentage}>{source.percentage}%</span>
            </div>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{ 
                  width: `${source.percentage}%`,
                  backgroundColor: source.color 
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
