import { useState } from 'react'
import styles from './Navbar.module.css'

export default function Navbar({ user, onLogout }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)

  const notifications = [
    { id: 1, text: 'New order received', time: '2 min ago', read: false },
    { id: 2, text: 'User registration completed', time: '15 min ago', read: false },
    { id: 3, text: 'Monthly report generated', time: '1 hour ago', read: true },
  ]

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <header className={styles.navbar}>
      <div className={styles.navLeft}>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          <span className={styles.searchIcon}></span>
        </div>
      </div>

      <div className={styles.navRight}>
        <button className={styles.newOrderBtn}>
          + New Order
        </button>

        <div className={styles.notificationWrapper}>
          <button 
            className={styles.notificationBtn}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            🔔
            {unreadCount > 0 && <span className={styles.notificationBadge}>{unreadCount}</span>}
          </button>
          
          {showNotifications && (
            <div className={styles.notificationDropdown}>
              <div className={styles.notificationHeader}>
                <h3>Notifications</h3>
              </div>
              <div className={styles.notificationList}>
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`${styles.notificationItem} ${!notification.read ? styles.unread : ''}`}
                  >
                    <p className={styles.notificationText}>{notification.text}</p>
                    <span className={styles.notificationTime}>{notification.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={styles.userMenu}>
          <div className={styles.userAvatar}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <span className={styles.userName}>{user?.name || 'User'}</span>
          <button className={styles.logoutBtn} onClick={onLogout}>
            Sign Out
          </button>
        </div>
      </div>
    </header>
  )
}
