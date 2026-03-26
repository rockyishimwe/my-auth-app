import { createContext, useContext, useReducer } from 'react';
import { goalsService } from '../services/api';

// Initial state
const initialState = {
  goals: [],
  total: 0,
  page: 1,
  limit: 10,
  loading: false,
  error: null,
  filters: {
    context: '',
    status: '',
    priority: '',
    dueDate: null,
    search: ''
  },
  stats: null
};

// Action types
const SET_GOALS = 'SET_GOALS';
const ADD_GOAL = 'ADD_GOAL';
const UPDATE_GOAL = 'UPDATE_GOAL';
const DELETE_GOAL = 'DELETE_GOAL';
const SET_STATS = 'SET_STATS';
const SET_FILTERS = 'SET_FILTERS';
const SET_LOADING = 'SET_LOADING';
const SET_ERROR = 'SET_ERROR';
const SET_PAGE = 'SET_PAGE';

// Reducer
const goalsReducer = (state, action) => {
  switch (action.type) {
    case SET_GOALS:
      return {
        ...state,
        goals: action.payload.goals,
        total: action.payload.total,
        loading: false,
        error: null
      };
    
    case ADD_GOAL:
      return {
        ...state,
        goals: [action.payload, ...state.goals],
        total: state.total + 1,
        loading: false,
        error: null
      };
    
    case UPDATE_GOAL:
      return {
        ...state,
        goals: state.goals.map(goal => 
          goal._id === action.payload._id ? action.payload : goal
        ),
        loading: false,
        error: null
      };
    
    case DELETE_GOAL:
      return {
        ...state,
        goals: state.goals.filter(goal => goal._id !== action.payload),
        total: state.total - 1,
        loading: false,
        error: null
      };
    
    case SET_STATS:
      return {
        ...state,
        stats: action.payload
      };
    
    case SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      };
    
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    
    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    
    case SET_PAGE:
      return {
        ...state,
        page: action.payload
      };
    
    default:
      return state;
  }
};

// Create context
const GoalsContext = createContext(null);

// Provider component
export const GoalsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(goalsReducer, initialState);

  // Actions
  const fetchGoals = async (params = {}) => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      const response = await goalsService.getAll(params);
      dispatch({
        type: SET_GOALS,
        payload: {
          goals: response.data.data,
          total: response.data.pagination.total
        }
      });
    } catch (error) {
      dispatch({ type: SET_ERROR, payload: error.message });
    }
  };

  const createGoal = async (goalData) => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      const response = await goalsService.create(goalData);
      dispatch({
        type: ADD_GOAL,
        payload: response.data
      });
    } catch (error) {
      dispatch({ type: SET_ERROR, payload: error.message });
    }
  };

  const updateGoal = async (id, goalData) => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      const response = await goalsService.update(id, goalData);
      dispatch({
        type: UPDATE_GOAL,
        payload: response.data
      });
    } catch (error) {
      dispatch({ type: SET_ERROR, payload: error.message });
    }
  };

  const deleteGoal = async (id) => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      await goalsService.delete(id);
      dispatch({
        type: DELETE_GOAL,
        payload: id
      });
    } catch (error) {
      dispatch({ type: SET_ERROR, payload: error.message });
    }
  };

  const updateProgress = async (id, progress) => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      const response = await goalsService.updateProgress(id, { progress });
      dispatch({
        type: UPDATE_GOAL,
        payload: response.data
      });
    } catch (error) {
      dispatch({ type: SET_ERROR, payload: error.message });
    }
  };

  const updateStatus = async (id, status) => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      const response = await goalsService.updateStatus(id, { status });
      dispatch({
        type: UPDATE_GOAL,
        payload: response.data
      });
    } catch (error) {
      dispatch({ type: SET_ERROR, payload: error.message });
    }
  };

  const setFilters = (filters) => {
    dispatch({ type: SET_FILTERS, payload: filters });
  };

  const setPage = (page) => {
    dispatch({ type: SET_PAGE, payload: page });
  };

  const fetchStats = async () => {
    try {
      const response = await goalsService.getStats();
      dispatch({
        type: SET_STATS,
        payload: response.data
      });
    } catch (error) {
      dispatch({ type: SET_ERROR, payload: error.message });
    }
  };

  const value = {
    ...state,
    fetchGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    updateProgress,
    updateStatus,
    setFilters,
    setPage,
    fetchStats
  };

  return (
    <GoalsContext.Provider value={value}>
      {children}
    </GoalsContext.Provider>
  );
};

// Custom hook
export const useGoals = () => {
  const context = useContext(GoalsContext);
  if (!context) {
    throw new Error('useGoals must be used within a GoalsProvider');
  }
  return context;
};

export default GoalsContext;
