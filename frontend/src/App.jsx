import { useState, useEffect, createContext, useContext } from 'react'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import About from './pages/About'
import { authApi } from './api'

const AuthContext = createContext(null)

export const useAuth = () => useContext(AuthContext)

export default function App() {
  const [user, setUser] = useState(null)
  const [page, setPage] = useState('landing')
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
    setPage('dashboard')
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setPage('landing')
  }

  const navigateTo = (targetPage) => {
    setPage(targetPage)
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

  const renderPage = () => {
    // Landing pages (not authenticated)
    if (!user) {
      switch (page) {
        case 'login':
          return <Login onSwitch={() => setPage('register')} />
        case 'register':
          return <Register onSwitch={() => setPage('login')} />
        default:
          return <Landing />
      }
    }

    // Authenticated pages
    switch (page) {
      case 'dashboard':
        return <Dashboard />
      case 'profile':
        return <Profile />
      case 'settings':
        return <Settings />
      case 'about':
        return <About />
      default:
        return <Dashboard />
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, navigateTo }}>
      {renderPage()}
    </AuthContext.Provider>
  )
}
