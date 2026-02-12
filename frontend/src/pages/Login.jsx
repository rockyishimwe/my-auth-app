import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { FaSignInAlt } from 'react-icons/fa'
import { login, reset } from "../features/auth/authSlice"
import Spinner from "../components/Spinner"

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const { email, password } = formData

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )

  // Handle side effects
  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    if (isSuccess || user) {
      // Check if user should be admin and update role if needed
      if (user && user.email === 'admin@gmail.com' && user.name.toLowerCase() === 'awk') {
        const userWithRole = {
          ...user,
          role: 'admin'
        }
        localStorage.setItem('user', JSON.stringify(userWithRole))
        
        // Update in all_users too
        const allUsers = JSON.parse(localStorage.getItem('all_users')) || []
        const userIndex = allUsers.findIndex(u => u._id === user._id)
        if (userIndex !== -1) {
          allUsers[userIndex] = userWithRole
          localStorage.setItem('all_users', JSON.stringify(allUsers))
        }
      }
      
      navigate("/")
    }

    dispatch(reset())
  }, [user, isError, isSuccess, message, navigate, dispatch])

  // Update form fields
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  // Handle form submission
  const onSubmit = (e) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }

    const userData = { email, password }
    dispatch(login(userData))
  }

  // Show spinner if loading
  if (isLoading) {
    return <Spinner />
  }

  return (
    <div className="form-wrapper">
      <section className="heading">
        <h1>
          <FaSignInAlt /> Login
        </h1>
        <p className="paragraph">Login and start setting goals</p>
      </section>

      <section className="form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={email}
              placeholder="Enter your email"
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={password}
              placeholder="Enter password"
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-block">Submit</button>
          </div>
        </form>

        {/* Admin credentials hint */}
        <div style={{ 
          marginTop: '20px', 
          padding: '12px', 
          background: 'rgba(255, 255, 255, 0.1)', 
          borderRadius: '8px',
          fontSize: '13px',
          color: '#cccccc',
          textAlign: 'center'
        }}>
         Admin login: admin@gmail.com  "awk"
        </div>
      </section>
    </div>
  )
}