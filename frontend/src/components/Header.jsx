import { FaSignInAlt, FaUser, FaBullseye, FaArrowLeft } from 'react-icons/fa'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout, reset } from '../features/auth/authSlice'

function Header() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const location = useLocation()

  const onLogout = () => {
    dispatch(logout())
    dispatch(reset())
    navigate('/login')
  }

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'

  return (
    <header>
      <div className="header-container">
        <Link to="/" className="logo">
          <FaBullseye /> GoalSetter
        </Link>

        <nav>
          {user ? (
            <>
              <button 
                className="btn btn-block" 
                onClick={onLogout} 
                style={{ padding: '8px 16px', fontSize: '14px', borderRadius: '8px' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {isAuthPage && (
                <button 
                  className="btn btn-back"
                  onClick={() => navigate('/')}
                >
                  <FaArrowLeft /> Go Back
                </button>
              )}
              <button 
                className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
                onClick={() => navigate('/login')}
              >
                <FaSignInAlt /> <span>Login</span>
              </button>
              <button 
                className={`nav-link ${location.pathname === '/register' ? 'active' : ''}`}
                onClick={() => navigate('/register')}
              >
                <FaUser /> <span>Register</span>
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header