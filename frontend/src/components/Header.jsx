import { FaSignInAlt, FaUser, FaBullseye } from 'react-icons/fa'
import { Link, useLocation } from 'react-router-dom'

function Header() {
  const location = useLocation()

  return (
    <header>
      <div className="header-container">
        <Link to="/" className="logo">
          <FaBullseye /> GoalSetter
        </Link>
        <nav>
          <Link 
            to="/login" 
            className={location.pathname === '/login' ? 'active' : ''}
          >
            <FaSignInAlt /> <h2>Login</h2>
          </Link>
          <Link 
            to="/register" 
            className={location.pathname === '/register' ? 'active' : ''}
          >
            <FaUser /> <h2>Register</h2>
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header