import { useState, useEffect, createContext, useContext } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import { authApi } from './api'

const AuthContext = createContext(null)

export const useAuth = () => useContext(AuthContext)

export default function App() {
  const [user, setUser] = useState(null)
  const [page, setPage] = useState('login')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { setLoading(false); return }
    authApi.me(token)
      .then((u) => setUser({ ...u, token }))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false))
  }, [])

  const login = (userData) => {
    localStorage.setItem('token', userData.token)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setPage('login')
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          Loading...
        </span>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {user ? (
        <Dashboard />
      ) : page === 'login' ? (
        <Login onSwitch={() => setPage('register')} />
      ) : (
        <Register onSwitch={() => setPage('login')} />
      )}
    </AuthContext.Provider>
  )
}
