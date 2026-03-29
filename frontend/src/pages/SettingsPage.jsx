import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useUI } from '../contexts/GoalsContext';
import '../styles/variables.css';

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const { addToast } = useUI();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateProfile(formData);
      addToast('success', 'Profile updated successfully');
    } catch (error) {
      addToast('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header style={{ marginBottom: 'var(--spacing-5)' }}>
        <h1 style={{ fontSize: 'var(--font-3xl)', fontWeight: 'bold', margin: 0 }}>
          Settings
        </h1>
      </header>

      <div style={{ 
        background: 'var(--surface)',
        borderRadius: 'var(--radius)',
        padding: 'var(--spacing-5)',
        marginBottom: 'var(--spacing-5)'
      }}>
        <h2 style={{ fontSize: 'var(--font-xl)', margin: '0 0 var(--spacing-4) 0' }}>
          Profile Settings
        </h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-1)', fontSize: 'var(--font-sm)', color: 'var(--text)' }}>
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: 'var(--spacing-2)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                background: 'var(--bg-primary)',
                color: 'var(--text)',
                fontSize: 'var(--font-base)'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-1)', fontSize: 'var(--font-sm)', color: 'var(--text)' }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: 'var(--spacing-2)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                background: 'var(--bg-primary)',
                color: 'var(--text)',
                fontSize: 'var(--font-base)'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: 'var(--work)',
              color: 'white',
              border: 'none',
              padding: 'var(--spacing-2) var(--spacing-4)',
              borderRadius: 'var(--radius)',
              fontSize: 'var(--font-base)',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'var(--transition-fast)'
            }}
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>

      <div style={{ 
        background: 'var(--surface)',
        borderRadius: 'var(--radius)',
        padding: 'var(--spacing-5)'
      }}>
        <h2 style={{ fontSize: 'var(--font-xl)', margin: '0 0 var(--spacing-4) 0' }}>
          Application Settings
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
          <div style={{ 
            padding: 'var(--spacing-3)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            background: 'var(--bg-primary)'
          }}>
            <h3 style={{ fontSize: 'var(--font-base)', margin: '0 0 var(--spacing-2) 0' }}>
              Theme
            </h3>
            <p style={{ margin: 0, fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
              Theme customization coming soon...
            </p>
          </div>

          <div style={{ 
            padding: 'var(--spacing-3)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            background: 'var(--bg-primary)'
          }}>
            <h3 style={{ fontSize: 'var(--font-base)', margin: '0 0 var(--spacing-2) 0' }}>
              Notifications
            </h3>
            <p style={{ margin: 0, fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
              Notification settings coming soon...
            </p>
          </div>

          <div style={{ 
            padding: 'var(--spacing-3)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            background: 'var(--bg-primary)'
          }}>
            <h3 style={{ fontSize: 'var(--font-base)', margin: '0 0 var(--spacing-2) 0' }}>
              Data & Privacy
            </h3>
            <p style={{ margin: 0, fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
              Data management options coming soon...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
