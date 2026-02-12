import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { FaUser } from "react-icons/fa"
import { register, reset } from "../features/auth/authSlice"
import Spinner from "../components/Spinner"
import SecureStorage from "../utils/SecureStorage"

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  })

  const { name, email, password, password2 } = formData

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )

 
  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    if (isSuccess || user) {
      
      const isAdmin = user.email === 'admin@gmail.com' && user.name.toLowerCase() === 'awk'
      
      
      const allUsers = SecureStorage.getItem('all_users') || []
      
      const userWithRole = {
        ...user,
        role: isAdmin ? 'admin' : 'user',
        createdAt: user.createdAt || new Date().toISOString()
      }
      
      
      SecureStorage.setItem('user', userWithRole)
      
      
      const existingUserIndex = allUsers.findIndex(u => u._id === user._id)
      if (existingUserIndex === -1) {
        allUsers.push(userWithRole)
        SecureStorage.setItem('all_users', allUsers)
      } else {
       
        allUsers[existingUserIndex] = userWithRole
        SecureStorage.setItem('all_users', allUsers)
      }

      
      if (isAdmin) {
        toast.success(' Admin account created successfully!')
      } else {
        toast.success('Account created successfully!')
      }

      navigate("/")
    }

    dispatch(reset())
  }, [user, isError, isSuccess, message, navigate, dispatch])

  
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

 
  const onSubmit = (e) => {
    e.preventDefault()

    if (password !== password2) {
      toast.error("Passwords do not match")
      return
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    const userData = { name, email, password }
    dispatch(register(userData))
  }

 
  if (isLoading) {
    return <Spinner />
  }

  return (
    <div className="form-wrapper">
      <section className="heading">
        <h1>
          <FaUser /> Register
        </h1>
        <p>Please create an account</p>
      </section>

      <section className="form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={name}
              placeholder="Enter your name"
              onChange={onChange}
              required
            />
          </div>

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
              placeholder="Enter password (min 6 characters)"
              onChange={onChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              className="form-control"
              id="password2"
              name="password2"
              value={password2}
              placeholder="Confirm password"
              onChange={onChange}
              required
            />
          </div>

          <div className="form-group">
            <button type="submit" className="btn btn-block">
              Submit
            </button>
          </div>
        </form>

        {}
        <div style={{ 
          marginTop: '20px', 
          padding: '12px', 
          background: 'rgba(255, 255, 255, 0.1)', 
          borderRadius: '8px',
          fontSize: '13px',
          color: '#cccccc',
          textAlign: 'center'
        }}>
          Admin access: Use email "admin@gmail.com" and name "awk"
        </div>
      </section>
    </div>
  )
}