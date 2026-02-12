import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Header from './components/Header'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import './index.css'
import Settings from './pages/Settings'
import ProtectedRoute from './components/ProtectedRoute'
import { checkSession } from './features/auth/authSlice'

function App() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)


  useEffect(() => {
  if (!user) return

  const interval = setInterval(() => {
    dispatch(checkSession())
  }, 60000)

  return () => clearInterval(interval)
}, [dispatch, user])


useEffect(() => {
  if (!user) return

  const handleFocus = () => {
    dispatch(checkSession())
  }

  window.addEventListener('focus', handleFocus)
  return () => window.removeEventListener('focus', handleFocus)
}, [dispatch, user])


  return (
    <>
      <Router>
        <Header />
        <div className="container">
          <Routes>
            {}
            <Route 
              path="/login" 
              element={user ? <Navigate to="/" replace /> : <Login />} 
            />
            <Route 
              path="/register" 
              element={user ? <Navigate to="/" replace /> : <Register />} 
            />

            {}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

            {}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  )
}

export default App