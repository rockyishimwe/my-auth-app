import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useAuth } from '../contexts/AuthContext';
import { useUI } from '../contexts/UIContext';
import { authService } from '../services/api';
import '../styles/variables.css';

const avatarColors = [
  '#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6',
  '#ec4899', '#ef4444', '#f97316', '#06b6d4'
];

export default function ProfilePage() {
  const { user, login, logout } = useAuth();
  const { addToast } = useUI();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatarColor: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        avatarColor: user.avatarColor || avatarColors[0]
      });
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setErrors({ name: 'Name is required' });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await authService.updateProfile(formData);
      login(response.data);
      setIsEditing(false);
      addToast('success', 'Profile updated successfully');
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    const newErrors = {};
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setIsChangingPassword(false);
      addToast('success', 'Password changed successfully');
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || 'Failed to change password' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await authService.deleteAccount();
      logout();
      addToast('success', 'Account deleted successfully');
    } catch (error) {
      addToast('error', error.response?.data?.message || 'Failed to delete account');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const userStats = {
    totalGoals: 0, // This would come from goals context
    completedGoals: 0,
    streak: 0,
    joinDate: new Date(user.createdAt || Date.now()).toLocaleDateString()
  };

  return (
    <div className="container">
      <header style={{ marginBottom: 'var(--spacing-5)' }}>
        <h1 style={{ fontSize: 'var(--font-3xl)', fontWeight: 'bold', margin: 0 }}>
          Profile & Settings
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3" style={{ gap: 'var(--spacing-5)' }}>
        {/* Profile Section */}
        <div className="lg:col-span-2">
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: 'var(--spacing-5)',
            boxShadow: 'var(--shadow-md)',
            marginBottom: 'var(--spacing-4)'
          }}>
            <div className="flex-between" style={{ marginBottom: 'var(--spacing-4)' }}>
              <h2 style={{ fontSize: 'var(--font-xl)', margin: 0 }}>Profile Information</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    background: 'var(--work)',
                    color: 'white',
                    border: 'none',
                    padding: 'var(--spacing-2) var(--spacing-3)',
                    borderRadius: 'var(--radius)',
                    fontSize: 'var(--font-base)',
                    cursor: 'pointer'
                  }}
                >
                  Edit Profile
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 'var(--spacing-1)', fontSize: 'var(--font-sm)', color: 'var(--text)' }}>
                    Avatar Color
                  </label>
                  <div className="flex" style={{ gap: 'var(--spacing-2)' }}>
                    {avatarColors.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, avatarColor: color }))}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: color,
                          border: formData.avatarColor === color ? '3px solid var(--text)' : '2px solid transparent',
                          cursor: 'pointer',
                          transition: 'var(--transition-fast)'
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 'var(--spacing-1)', fontSize: 'var(--font-sm)', color: 'var(--text)' }}>
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-2)',
                      border: errors.name ? '1px solid var(--priority-critical)' : '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      fontSize: 'var(--font-base)'
                    }}
                  />
                  {errors.name && (
                    <div style={{ fontSize: 'var(--font-sm)', color: 'var(--priority-critical)', marginTop: 'var(--spacing-1)' }}>
                      {errors.name}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 'var(--spacing-1)', fontSize: 'var(--font-sm)', color: 'var(--text)' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-2)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      fontSize: 'var(--font-base)',
                      background: 'var(--bg)',
                      color: 'var(--text-muted)'
                    }}
                  />
                  <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)', marginTop: 'var(--spacing-1)' }}>
                    Email cannot be changed
                  </div>
                </div>

                {errors.submit && (
                  <div style={{ 
                    fontSize: 'var(--font-sm)', 
                    color: 'var(--priority-critical)', 
                    padding: 'var(--spacing-2)',
                    background: 'rgba(239, 68, 68, 0.1)',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--priority-critical)'
                  }}>
                    {errors.submit}
                  </div>
                )}

                <div className="flex" style={{ gap: 'var(--spacing-2)' }}>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      background: loading ? 'var(--text-muted)' : 'var(--work)',
                      color: 'white',
                      border: 'none',
                      padding: 'var(--spacing-2) var(--spacing-3)',
                      borderRadius: 'var(--radius)',
                      fontSize: 'var(--font-base)',
                      cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <Icon icon="solar:check-circle-bold" width={16} height={16} style={{ marginRight: 'var(--spacing-2)' }} />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setErrors({});
                      setFormData({
                        name: user.name || '',
                        email: user.email || '',
                        avatarColor: user.avatarColor || avatarColors[0]
                      });
                    }}
                    style={{
                      background: 'var(--surface)',
                      color: 'var(--text)',
                      border: '1px solid var(--border)',
                      padding: 'var(--spacing-2) var(--spacing-3)',
                      borderRadius: 'var(--radius)',
                      fontSize: 'var(--font-base)',
                      cursor: 'pointer'
                    }}
                  >
                    <Icon icon="solar:close-circle-bold" width={16} height={16} style={{ marginRight: 'var(--spacing-2)' }} />
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: user.avatarColor || avatarColors[0],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'var(--font-2xl)',
                  fontWeight: 'bold',
                  color: 'white'
                }}>
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <h3 style={{ fontSize: 'var(--font-lg)', margin: '0 0 var(--spacing-1) 0' }}>
                    {user.name}
                  </h3>
                  <p style={{ fontSize: 'var(--font-base)', color: 'var(--text-muted)', margin: 0 }}>
                    {user.email}
                  </p>
                  <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)', margin: 'var(--spacing-1) 0 0 0' }}>
                    Member since {userStats.joinDate}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Password Change Section */}
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: 'var(--spacing-5)',
            boxShadow: 'var(--shadow-md)',
            marginBottom: 'var(--spacing-4)'
          }}>
            <div className="flex-between" style={{ marginBottom: 'var(--spacing-4)' }}>
              <h2 style={{ fontSize: 'var(--font-xl)', margin: 0 }}>Change Password</h2>
              {!isChangingPassword && (
                <button
                  onClick={() => setIsChangingPassword(true)}
                  style={{
                    background: 'var(--work)',
                    color: 'white',
                    border: 'none',
                    padding: 'var(--spacing-2) var(--spacing-3)',
                    borderRadius: 'var(--radius)',
                    fontSize: 'var(--font-base)',
                    cursor: 'pointer'
                  }}
                >
                  Change Password
                </button>
              )}
            </div>

            {isChangingPassword && (
              <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 'var(--spacing-1)', fontSize: 'var(--font-sm)', color: 'var(--text)' }}>
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordInputChange}
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-2)',
                      border: errors.currentPassword ? '1px solid var(--priority-critical)' : '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      fontSize: 'var(--font-base)'
                    }}
                  />
                  {errors.currentPassword && (
                    <div style={{ fontSize: 'var(--font-sm)', color: 'var(--priority-critical)', marginTop: 'var(--spacing-1)' }}>
                      {errors.currentPassword}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 'var(--spacing-1)', fontSize: 'var(--font-sm)', color: 'var(--text)' }}>
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordInputChange}
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-2)',
                      border: errors.newPassword ? '1px solid var(--priority-critical)' : '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      fontSize: 'var(--font-base)'
                    }}
                  />
                  {errors.newPassword && (
                    <div style={{ fontSize: 'var(--font-sm)', color: 'var(--priority-critical)', marginTop: 'var(--spacing-1)' }}>
                      {errors.newPassword}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 'var(--spacing-1)', fontSize: 'var(--font-sm)', color: 'var(--text)' }}>
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordInputChange}
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-2)',
                      border: errors.confirmPassword ? '1px solid var(--priority-critical)' : '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      fontSize: 'var(--font-base)'
                    }}
                  />
                  {errors.confirmPassword && (
                    <div style={{ fontSize: 'var(--font-sm)', color: 'var(--priority-critical)', marginTop: 'var(--spacing-1)' }}>
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>

                {errors.submit && (
                  <div style={{ 
                    fontSize: 'var(--font-sm)', 
                    color: 'var(--priority-critical)', 
                    padding: 'var(--spacing-2)',
                    background: 'rgba(239, 68, 68, 0.1)',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--priority-critical)'
                  }}>
                    {errors.submit}
                  </div>
                )}

                <div className="flex" style={{ gap: 'var(--spacing-2)' }}>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      background: loading ? 'var(--text-muted)' : 'var(--work)',
                      color: 'white',
                      border: 'none',
                      padding: 'var(--spacing-2) var(--spacing-3)',
                      borderRadius: 'var(--radius)',
                      fontSize: 'var(--font-base)',
                      cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {loading ? 'Changing...' : 'Change Password'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setErrors({});
                      setPasswordData({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      });
                    }}
                    style={{
                      background: 'var(--surface)',
                      color: 'var(--text)',
                      border: '1px solid var(--border)',
                      padding: 'var(--spacing-2) var(--spacing-3)',
                      borderRadius: 'var(--radius)',
                      fontSize: 'var(--font-base)',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Stats & Danger Zone */}
        <div>
          {/* Account Stats */}
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: 'var(--spacing-4)',
            boxShadow: 'var(--shadow-md)',
            marginBottom: 'var(--spacing-4)'
          }}>
            <h3 style={{ fontSize: 'var(--font-lg)', margin: '0 0 var(--spacing-3) 0' }}>Account Stats</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <div className="flex-between">
                <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>Total Goals</span>
                <span style={{ fontSize: 'var(--font-base)', fontWeight: 'bold' }}>{userStats.totalGoals}</span>
              </div>
              
              <div className="flex-between">
                <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>Completed</span>
                <span style={{ fontSize: 'var(--font-base)', fontWeight: 'bold', color: 'var(--status-completed)' }}>{userStats.completedGoals}</span>
              </div>
              
              <div className="flex-between">
                <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>Current Streak</span>
                <span style={{ fontSize: 'var(--font-base)', fontWeight: 'bold', color: 'var(--work)' }}>{userStats.streak} days</span>
              </div>
              
              <div className="flex-between">
                <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>Member Since</span>
                <span style={{ fontSize: 'var(--font-base)', fontWeight: 'bold' }}>{userStats.joinDate}</span>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--priority-critical)',
            borderRadius: 'var(--radius)',
            padding: 'var(--spacing-4)',
            boxShadow: 'var(--shadow-md)'
          }}>
            <h3 style={{ fontSize: 'var(--font-lg)', margin: '0 0 var(--spacing-3) 0', color: 'var(--priority-critical)' }}>
              Danger Zone
            </h3>
            
            <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)', margin: '0 0 var(--spacing-3) 0' }}>
              Once you delete your account, there is no going back. Please be certain.
            </p>
            
            <button
              onClick={() => setShowDeleteModal(true)}
              style={{
                background: 'var(--priority-critical)',
                color: 'white',
                border: 'none',
                padding: 'var(--spacing-2) var(--spacing-3)',
                borderRadius: 'var(--radius)',
                fontSize: 'var(--font-base)',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 'var(--z-modal)'
        }}>
          <div style={{
            background: 'var(--surface)',
            borderRadius: 'var(--radius)',
            padding: 'var(--spacing-5)',
            width: '90%',
            maxWidth: '400px'
          }}>
            <h3 style={{ fontSize: 'var(--font-lg)', margin: '0 0 var(--spacing-3) 0', color: 'var(--priority-critical)' }}>
              Delete Account
            </h3>
            
            <p style={{ fontSize: 'var(--font-base)', color: 'var(--text)', margin: '0 0 var(--spacing-4) 0' }}>
              Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.
            </p>
            
            <div className="flex" style={{ gap: 'var(--spacing-2)' }}>
              <button
                onClick={handleDeleteAccount}
                style={{
                  background: 'var(--priority-critical)',
                  color: 'white',
                  border: 'none',
                  padding: 'var(--spacing-2) var(--spacing-3)',
                  borderRadius: 'var(--radius)',
                  fontSize: 'var(--font-base)',
                  cursor: 'pointer'
                }}
              >
                Delete Account
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{
                  background: 'var(--surface)',
                  color: 'var(--text)',
                  border: '1px solid var(--border)',
                  padding: 'var(--spacing-2) var(--spacing-3)',
                  borderRadius: 'var(--radius)',
                  fontSize: 'var(--font-base)',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
