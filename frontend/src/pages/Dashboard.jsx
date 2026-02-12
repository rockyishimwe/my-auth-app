import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import UserDashboard from './UserDashboard'
import AdminDashboard from './AdminDashboard'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  // Route based on user role
  if (user?.role === 'admin') {
    return <AdminDashboard />
  }

  return <UserDashboard />
}