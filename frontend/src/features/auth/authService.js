import axios from 'axios'
import SecureStorage from '../../utils/SecureStorage'

const API_URL = '/api/users/'


const SESSION_TIMEOUT = 30 * 60 * 1000


const register = async (userData) => {
  const response = await axios.post(API_URL, userData)

  if (response.data) {
    
    const userWithSession = {
      ...response.data,
      loginTime: Date.now(),
      expiresAt: Date.now() + SESSION_TIMEOUT
    }
    SecureStorage.setItem('user', userWithSession)
  }
  return response.data
}


const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData)

  if (response.data) {
   
    const userWithSession = {
      ...response.data,
      loginTime: Date.now(),
      expiresAt: Date.now() + SESSION_TIMEOUT
    }
    SecureStorage.setItem('user', userWithSession)
  }
  return response.data
}


const logout = () => {
  SecureStorage.removeItem('user')
  SecureStorage.removeItem('all_users')
  
  const keys = Object.keys(localStorage)
  keys.forEach(key => {
    if (key.startsWith('goals_')) {
      localStorage.removeItem(key)
    }
  })
}


const isSessionValid = () => {
  const user = SecureStorage.getItem('user')
  if (!user) return false
  
  const now = Date.now()
  if (user.expiresAt && now > user.expiresAt) {
    
    logout()
    return false
  }
  
  return true
}


const refreshSession = () => {
  const user = SecureStorage.getItem('user')
  if (user) {
    user.expiresAt = Date.now() + SESSION_TIMEOUT
    SecureStorage.setItem('user', user)
  }
}


const getCurrentUser = () => {
  if (!isSessionValid()) {
    return null
  }
  refreshSession() 
  return SecureStorage.getItem('user')
}

const authService = {
  register,
  login,
  logout,
  isSessionValid,
  refreshSession,
  getCurrentUser
}

export default authService