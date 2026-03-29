import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/api';
import '../styles/variables.css';

export default function LoginPage() {
  const { login, register, user } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (isRegister) {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      } else if (formData.name.length < 2) {
        newErrors.name = 'Name must be at least 2 characters';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      if (isRegister) {
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
      } else {
        await login({
          email: formData.email,
          password: formData.password
        });
      }
    } catch (error) {
      const message = error.response?.data?.message || 'An error occurred';
      setErrors({ submit: message });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
  };

  // Redirect to dashboard if user is logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--spacing-4)'
    }}>
      <div style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius)',
        padding: 'var(--spacing-7)',
        width: '100%',
        maxWidth: '400px',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-6)' }}>
          <h1 style={{
            fontSize: 'var(--font-3xl)',
            fontWeight: 'bold',
            color: 'var(--text)',
            margin: '0 0 var(--spacing-2) 0'
          }}>
            GoalOS
          </h1>
          <p style={{
            fontSize: 'var(--font-base)',
            color: 'var(--text-muted)',
            margin: 0
          }}>
            {isRegister ? 'Create your account' : 'Welcome back'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          {isRegister && (
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: 'var(--spacing-1)', 
                fontSize: 'var(--font-sm)', 
                color: 'var(--text)',
                fontWeight: 'bold'
              }}>
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                style={{
                  width: '100%',
                  padding: 'var(--spacing-3)',
                  border: errors.name ? '1px solid var(--priority-critical)' : '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: 'var(--font-base)',
                  fontFamily: 'JetBrains Mono, monospace',
                  background: 'var(--bg)',
                  color: 'var(--text)'
                }}
              />
              {errors.name && (
                <div style={{ 
                  fontSize: 'var(--font-sm)', 
                  color: 'var(--priority-critical)', 
                  marginTop: 'var(--spacing-1)' 
                }}>
                  {errors.name}
                </div>
              )}
            </div>
          )}

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: 'var(--spacing-1)', 
              fontSize: 'var(--font-sm)', 
              color: 'var(--text)',
              fontWeight: 'bold'
            }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              style={{
                width: '100%',
                padding: 'var(--spacing-3)',
                border: errors.email ? '1px solid var(--priority-critical)' : '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                fontSize: 'var(--font-base)',
                fontFamily: 'JetBrains Mono, monospace',
                background: 'var(--bg)',
                color: 'var(--text)'
              }}
            />
            {errors.email && (
              <div style={{ 
                fontSize: 'var(--font-sm)', 
                color: 'var(--priority-critical)', 
                marginTop: 'var(--spacing-1)' 
              }}>
                {errors.email}
              </div>
            )}
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: 'var(--spacing-1)', 
              fontSize: 'var(--font-sm)', 
              color: 'var(--text)',
              fontWeight: 'bold'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                style={{
                  width: '100%',
                  padding: 'var(--spacing-3)',
                  paddingRight: 'var(--spacing-8)',
                  border: errors.password ? '1px solid var(--priority-critical)' : '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: 'var(--font-base)',
                  fontFamily: 'JetBrains Mono, monospace',
                  background: 'var(--bg)',
                  color: 'var(--text)'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 'var(--spacing-2)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: 'var(--font-sm)',
                  padding: 'var(--spacing-1)'
                }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && (
              <div style={{ 
                fontSize: 'var(--font-sm)', 
                color: 'var(--priority-critical)', 
                marginTop: 'var(--spacing-1)' 
              }}>
                {errors.password}
              </div>
            )}
          </div>

          {isRegister && (
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: 'var(--spacing-1)', 
                fontSize: 'var(--font-sm)', 
                color: 'var(--text)',
                fontWeight: 'bold'
              }}>
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-3)',
                    paddingRight: 'var(--spacing-8)',
                    border: errors.confirmPassword ? '1px solid var(--priority-critical)' : '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    fontSize: 'var(--font-base)',
                    fontFamily: 'JetBrains Mono, monospace',
                    background: 'var(--bg)',
                    color: 'var(--text)'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: 'var(--spacing-2)',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: 'var(--font-sm)',
                    padding: 'var(--spacing-1)'
                  }}
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.confirmPassword && (
                <div style={{ 
                  fontSize: 'var(--font-sm)', 
                  color: 'var(--priority-critical)', 
                  marginTop: 'var(--spacing-1)' 
                }}>
                  {errors.confirmPassword}
                </div>
              )}
            </div>
          )}

          {errors.submit && (
            <div style={{ 
              fontSize: 'var(--font-sm)', 
              color: 'var(--priority-critical)', 
              textAlign: 'center',
              padding: 'var(--spacing-2)',
              background: 'rgba(239, 68, 68, 0.1)',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--priority-critical)'
            }}>
              {errors.submit}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? 'var(--text-muted)' : 'var(--work)',
              color: 'white',
              border: 'none',
              padding: 'var(--spacing-3)',
              borderRadius: 'var(--radius)',
              fontSize: 'var(--font-base)',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'var(--transition-fast)',
              fontFamily: 'JetBrains Mono, monospace'
            }}
          >
            {loading ? 'Please wait...' : (isRegister ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div style={{ 
          textAlign: 'center', 
          marginTop: 'var(--spacing-4)', 
          fontSize: 'var(--font-sm)',
          color: 'var(--text-muted)'
        }}>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={toggleMode}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--work)',
              cursor: 'pointer',
              fontSize: 'var(--font-sm)',
              fontWeight: 'bold',
              textDecoration: 'underline'
            }}
          >
            {isRegister ? 'Sign in' : 'Sign up'}
          </button>
        </div>
      </div>
    </div>
  );
}
