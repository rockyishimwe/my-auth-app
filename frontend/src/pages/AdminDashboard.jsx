import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { FaTrash, FaUser, FaSearch, FaCrown } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { checkSession } from '../features/auth/authSlice'
import SecureStorage from '../utils/SecureStorage'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredUsers, setFilteredUsers] = useState([])

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

   
    dispatch(checkSession())
    
    
    if (user.role !== 'admin') {
      toast.error('Access denied. Admin only!')
      navigate('/')
      return
    }

    
    loadUsers()
  }, [user, navigate, dispatch])

  useEffect(() => {
    
    if (searchTerm) {
      const filtered = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredUsers(filtered)
    } else {
      setFilteredUsers(users)
    }
  }, [searchTerm, users])

  const loadUsers = () => {
    
    const allUsers = SecureStorage.getItem('all_users') || []
    setUsers(allUsers)
    setFilteredUsers(allUsers)
  }

  const deleteUser = (userId) => {
    if (userId === user._id) {
      toast.error('You cannot delete your own account!')
      return
    }

    if (window.confirm('Are you sure you want to delete this user?')) {
      const updatedUsers = users.filter(u => u._id !== userId)
      SecureStorage.setItem('all_users', updatedUsers)
      
      
      SecureStorage.removeItem(`goals_${userId}`)
      
      setUsers(updatedUsers)
      toast.success('User deleted successfully!')
    }
  }

  const toggleAdminRole = (userId) => {
    if (userId === user._id) {
      toast.error('You cannot change your own role!')
      return
    }

    const updatedUsers = users.map(u => {
      if (u._id === userId) {
        return { ...u, role: u.role === 'admin' ? 'user' : 'admin' }
      }
      return u
    })
    
    SecureStorage.setItem('all_users', updatedUsers)
    setUsers(updatedUsers)
    toast.success('User role updated!')
  }

  const getUserStats = () => {
    const totalUsers = users.length
    const admins = users.filter(u => u.role === 'admin').length
    const regularUsers = totalUsers - admins
    
    return { totalUsers, admins, regularUsers }
  }

  const stats = getUserStats()

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Admin Dashboard 👨‍💼</h1>
          <p className="dashboard-subtitle">Manage users and system settings</p>
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
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👤</div>
          <div className="stat-info">
            <h3>{stats.regularUsers}</h3>
            <p>Regular Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👨‍💼</div>
          <div className="stat-info">
            <h3>{stats.admins}</h3>
            <p>Admins</p>
          </div>
        </div>
      </div>

      <div className="users-section">
        <div className="section-header">
          <h2>User Management</h2>
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="users-table-container">
          {filteredUsers.length === 0 ? (
            <div className="empty-state">
              <p>{searchTerm ? 'No users found' : 'No users registered yet'}</p>
            </div>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u._id} className={u._id === user._id ? 'current-user' : ''}>
                    <td>
                      <div className="user-name">
                        <FaUser className="user-icon" />
                        {u.name}
                        {u._id === user._id && <span className="badge-you">You</span>}
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`role-badge ${u.role === 'admin' ? 'admin' : 'user'}`}>
                        {u.role === 'admin' && <FaCrown />}
                        {u.role || 'user'}
                      </span>
                    </td>
                    <td>{new Date(u.createdAt || Date.now()).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => toggleAdminRole(u._id)}
                          className="btn-icon btn-role"
                          title={u.role === 'admin' ? 'Remove admin' : 'Make admin'}
                          disabled={u._id === user._id}
                        >
                          <FaCrown />
                        </button>
                        <button
                          onClick={() => deleteUser(u._id)}
                          className="btn-icon btn-delete"
                          title="Delete user"
                          disabled={u._id === user._id}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}