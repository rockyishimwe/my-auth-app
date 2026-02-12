import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { FaUser, FaEnvelope, FaLock, FaSave, FaArrowLeft } from 'react-icons/fa'
import { logout, reset } from '../features/auth/authSlice'

export default function Settings() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [activeTab, setActiveTab] = useState('profile')

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    setProfileData({
      name: user.name || '',
      email: user.email || '',
    })
  }, [user, navigate])

  const onProfileChange = (e) => {
    setProfileData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const onPasswordChange = (e) => {
    setPasswordData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleProfileUpdate = (e) => {
    e.preventDefault()

    if (!profileData.name.trim() || !profileData.email.trim()) {
      toast.error('Name and email are required')
      return
    }

    // Update user in localStorage
    const updatedUser = {
      ...user,
      name: profileData.name,
      email: profileData.email,
    }

    localStorage.setItem('user', JSON.stringify(updatedUser))

    // Update in all_users list
    const allUsers = JSON.parse(localStorage.getItem('all_users')) || []
    const updatedAllUsers = allUsers.map(u => 
      u._id === user._id ? updatedUser : u
    )
    localStorage.setItem('all_users', JSON.stringify(updatedAllUsers))

    // Force re-login to update Redux state
    toast.success('Profile updated! Please log in again.')
    setTimeout(() => {
      dispatch(logout())
      dispatch(reset())
      navigate('/login')
    }, 1500)
  }

  const handlePasswordUpdate = (e) => {
    e.preventDefault()

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('All password fields are required')
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    // In a real app, you'd verify current password with backend
    // For now, we'll just update it
    const updatedUser = {
      ...user,
      password: passwordData.newPassword, // In real app, this would be hashed on backend
    }

    localStorage.setItem('user', JSON.stringify(updatedUser))

    // Update in all_users list
    const allUsers = JSON.parse(localStorage.getItem('all_users')) || []
    const updatedAllUsers = allUsers.map(u => 
      u._id === user._id ? updatedUser : u
    )
    localStorage.setItem('all_users', JSON.stringify(updatedAllUsers))

    toast.success('Password updated successfully!')
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
  }

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Remove user from all_users
      const allUsers = JSON.parse(localStorage.getItem('all_users')) || []
      const updatedUsers = allUsers.filter(u => u._id !== user._id)
      localStorage.setItem('all_users', JSON.stringify(updatedUsers))

      // Remove user's goals
      localStorage.removeItem(`goals_${user._id}`)

      // Logout
      dispatch(logout())
      dispatch(reset())
      toast.success('Account deleted successfully')
      navigate('/register')
    }
  }

  return (
    <div className="settings-container">
      <div className="settings-header">
        <button 
          className="btn-back-settings"
          onClick={() => navigate('/')}
        >
          <FaArrowLeft /> Back to Dashboard
        </button>
        <h1>Settings</h1>
        <p>Manage your account settings and preferences</p>
      </div>

      <div className="settings-tabs">
        <button
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <FaUser /> Profile
        </button>
        <button
          className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
          onClick={() => setActiveTab('password')}
        >
          <FaLock /> Password
        </button>
      </div>

      <div className="settings-content">
        {activeTab === 'profile' && (
          <div className="settings-section">
            <h2>Profile Information</h2>
            <form onSubmit={handleProfileUpdate} className="settings-form">
              <div className="form-group">
                <label htmlFor="name">
                  <FaUser /> Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={profileData.name}
                  onChange={onProfileChange}
                  className="form-control"
                  placeholder="Enter your name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  <FaEnvelope /> Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  onChange={onProfileChange}
                  className="form-control"
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label>Role</label>
                <input
                  type="text"
                  value={user?.role || 'user'}
                  className="form-control"
                  disabled
                  style={{ background: '#f5f5f5', cursor: 'not-allowed' }}
                />
                <small style={{ color: '#666', fontSize: '13px', marginTop: '5px', display: 'block' }}>
                  Contact admin to change your role
                </small>
              </div>

              <button type="submit" className="btn btn-primary">
                <FaSave /> Save Changes
              </button>
            </form>

            <div className="danger-zone">
              <h3>Danger Zone</h3>
              <p>Once you delete your account, there is no going back.</p>
              <button 
                onClick={handleDeleteAccount}
                className="btn btn-danger"
              >
                Delete Account
              </button>
            </div>
          </div>
        )}

        {activeTab === 'password' && (
          <div className="settings-section">
            <h2>Change Password</h2>
            <form onSubmit={handlePasswordUpdate} className="settings-form">
              <div className="form-group">
                <label htmlFor="currentPassword">
                  <FaLock /> Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={onPasswordChange}
                  className="form-control"
                  placeholder="Enter current password"
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">
                  <FaLock /> New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={onPasswordChange}
                  className="form-control"
                  placeholder="Enter new password"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">
                  <FaLock /> Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={onPasswordChange}
                  className="form-control"
                  placeholder="Confirm new password"
                />
              </div>

              <button type="submit" className="btn btn-primary">
                <FaSave /> Update Password
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}