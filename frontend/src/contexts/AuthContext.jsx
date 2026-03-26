import { createContext, useContext, useReducer } from 'react';
import { authService } from '../services/api';

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: false
};

// Action types
const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';
const UPDATE_PROFILE = 'UPDATE_PROFILE';

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false
      };
    
    case LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        loading: false
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

// Create context
const AuthContext = createContext(null);

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Actions
  const login = async (credentials) => {
    dispatch({ type: LOGIN, payload: { loading: true } });
    try {
      const response = await authService.login(credentials);
      localStorage.setItem('token', response.data.token);
      dispatch({
        type: LOGIN,
        payload: { user: response.data, token: response.data.token, loading: false }
      });
    } catch (error) {
      dispatch({ type: LOGIN, payload: { loading: false } });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: LOGOUT });
  };

  const updateProfile = async (userData) => {
    try {
      const response = await authService.updateProfile(userData);
      dispatch({
        type: UPDATE_PROFILE,
        payload: response.data
      });
    } catch (error) {
      throw error;
    }
  };

  const value = {
    ...state,
    login,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
