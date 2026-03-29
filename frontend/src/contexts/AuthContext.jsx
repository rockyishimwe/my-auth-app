import { createContext, useContext, useReducer } from 'react';
import { authService } from '../services/api';
import PropTypes from "prop-types";


// ─────────────────────────────────────────────
// Initial state
// ─────────────────────────────────────────────

const initialState = {
  user:    null,
  token:   localStorage.getItem('token'),
  loading: false,
  error:   null
};

// ─────────────────────────────────────────────
// Action types
// ─────────────────────────────────────────────

const SET_LOADING    = 'SET_LOADING';
const SET_ERROR      = 'SET_ERROR';
const LOGIN          = 'LOGIN';
const LOGOUT         = 'LOGOUT';
const UPDATE_PROFILE = 'UPDATE_PROFILE';

// ─────────────────────────────────────────────
// Reducer
// ─────────────────────────────────────────────
const authReducer = (state, action) => {
  switch (action.type) {
    case SET_LOADING:
      return { ...state, loading: action.payload };

    case SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case LOGIN:
      return {
        ...state,
        user:    action.payload.user,
        token:   action.payload.token,
        loading: false,
        error:   null
      };

    case LOGOUT:
      return {
        ...state,
        user:    null,
        token:   null,
        loading: false,
        error:   null
      };

    case UPDATE_PROFILE:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };

    default:
      return state;
  }
};

// ─────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────

const AuthContext = createContext(null);

// ─────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  
  // Debug: Log state changes
  console.log('AuthContext state:', state);

  const login = async (credentials) => {
    dispatch({ type: SET_LOADING, payload: true });
    dispatch({ type: SET_ERROR,   payload: null });
    try {
      const response = await authService.login(credentials);
      console.log('Login response:', response); // Debug log
      console.log('Response data:', response.data); // Debug log
      
      // Handle different response structures
      let user, token;
      
      if (response.data.data) {
        // Structure: { success: true, data: { user, token } }
        user = response.data.data.user;
        token = response.data.data.token;
      } else if (response.data.user && response.data.token) {
        // Structure: { user, token }
        user = response.data.user;
        token = response.data.token;
      } else {
        // Direct structure: { user, token }
        user = response.data.user;
        token = response.data.token;
      }
      
      console.log('Extracted user:', user, 'token:', token); // Debug log
      localStorage.setItem('token', token);
      console.log('Dispatching LOGIN action with:', { user, token }); // Debug log
      dispatch({ type: LOGIN, payload: { user, token } });
      console.log('LOGIN action dispatched'); // Debug log
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      console.log('Login error:', error); // Debug log
      dispatch({ type: SET_ERROR, payload: message });
      throw error;   // re-throw so the form can show the message
    }
  };

  const register = async (userData) => {
    dispatch({ type: SET_LOADING, payload: true });
    dispatch({ type: SET_ERROR,   payload: null });
    try {
      const response = await authService.register(userData);
      const { user, token } = response.data.data ?? response.data;
      localStorage.setItem('token', token);
      dispatch({ type: LOGIN, payload: { user, token } });
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch({ type: SET_ERROR, payload: message });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: LOGOUT });
  };

  const updateProfile = async (userData) => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      const response = await authService.updateProfile(userData);
      const updated = response.data.data ?? response.data;
      dispatch({ type: UPDATE_PROFILE, payload: updated });
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed';
      dispatch({ type: SET_ERROR, payload: message });
      throw error;
    } finally {
      dispatch({ type: SET_LOADING, payload: false });
    }
  };

  const clearError = () => dispatch({ type: SET_ERROR, payload: null });

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

// PropTypes for AuthProvider
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthContext;
