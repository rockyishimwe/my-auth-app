import { useState } from 'react'
import styles from './Sidebar.module.css'

export default function Sidebar({ isOpen, onToggle }) {
  const menuItems = [
    { icon: '📊', label: 'Dashboard', active: true },
    { icon: '👥', label: 'Users', active: false },
    { icon: '📦', label: 'Orders', active: false },
    { icon: '💰', label: 'Revenue', active: false },
    { icon: '📈', label: 'Analytics', active: false },
    { icon: '⚙️', label: 'Settings', active: false },
  ]

  return (
    <aside className={`${styles.sidebar} ${!isOpen ? styles.collapsed : ''}`}>
      <div className={styles.sidebarHeader}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>📊</span>
          <span className={styles.logoText}>Admin</span>
        </div>
        <button className={styles.toggleBtn} onClick={onToggle}>
          {isOpen ? '◀' : '▶'}
        </button>
      </div>
      
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {menuItems.map((item, index) => (
            <li key={index} className={styles.navItem}>
              <button className={`${styles.navButton} ${item.active ? styles.active : ''}`}>
                <span className={styles.navIcon}>{item.icon}</span>
                {isOpen && <span className={styles.navLabel}>{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
