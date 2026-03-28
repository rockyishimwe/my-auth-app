import { createContext, useContext, useReducer } from 'react';
import { goalsService } from '../services/api';

// ─────────────────────────────────────────────
// GOALS CONTEXT
// ─────────────────────────────────────────────

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

const SET_GOALS    = 'SET_GOALS';
const ADD_GOAL     = 'ADD_GOAL';
const UPDATE_GOAL  = 'UPDATE_GOAL';
const DELETE_GOAL  = 'DELETE_GOAL';
const SET_STATS    = 'SET_STATS';
const SET_FILTERS  = 'SET_FILTERS';
const SET_LOADING  = 'SET_LOADING';
const SET_ERROR    = 'SET_ERROR';
const SET_PAGE     = 'SET_PAGE';

const goalsReducer = (state, action) => {
  switch (action.type) {
    case SET_GOALS:
      return { ...state, goals: action.payload.goals, total: action.payload.total, loading: false, error: null };
    case ADD_GOAL:
      return { ...state, goals: [action.payload, ...state.goals], total: state.total + 1, loading: false, error: null };
    case UPDATE_GOAL:
      return { ...state, goals: state.goals.map(g => g._id === action.payload._id ? action.payload : g), loading: false, error: null };
    case DELETE_GOAL:
      return { ...state, goals: state.goals.filter(g => g._id !== action.payload), total: state.total - 1, loading: false, error: null };
    case SET_STATS:
      return { ...state, stats: action.payload };
    case SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case SET_LOADING:
      return { ...state, loading: action.payload };
    case SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case SET_PAGE:
      return { ...state, page: action.payload };
    default:
      return state;
  }
};

const GoalsContext = createContext(null);

export const GoalsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(goalsReducer, initialState);

  const fetchGoals = async (params = {}) => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      const response = await goalsService.getAll(params);
      dispatch({ type: SET_GOALS, payload: { goals: response.data.data, total: response.data.pagination.total } });
    } catch (error) {
      dispatch({ type: SET_ERROR, payload: error.message });
    }
  };

  const createGoal = async (goalData) => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      const response = await goalsService.create(goalData);
      dispatch({ type: ADD_GOAL, payload: response.data });
    } catch (error) {
      dispatch({ type: SET_ERROR, payload: error.message });
    }
  };

  const updateGoal = async (id, goalData) => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      const response = await goalsService.update(id, goalData);
      dispatch({ type: UPDATE_GOAL, payload: response.data });
      return response.data;
    } catch (error) {
      dispatch({ type: SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const deleteGoal = async (id) => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      await goalsService.delete(id);
      dispatch({ type: DELETE_GOAL, payload: id });
    } catch (error) {
      dispatch({ type: SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const updateProgress = async (id, progress) => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      const response = await goalsService.updateProgress(id, { progress });
      dispatch({ type: UPDATE_GOAL, payload: response.data });
    } catch (error) {
      dispatch({ type: SET_ERROR, payload: error.message });
    }
  };

  const updateStatus = async (id, status) => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      const response = await goalsService.updateStatus(id, { status });
      dispatch({ type: UPDATE_GOAL, payload: response.data });
    } catch (error) {
      dispatch({ type: SET_ERROR, payload: error.message });
    }
  };

  const setFilters = (filters) => dispatch({ type: SET_FILTERS, payload: filters });
  const setPage    = (page)    => dispatch({ type: SET_PAGE,    payload: page });

  const fetchStats = async () => {
    try {
      const response = await goalsService.getStats();
      dispatch({ type: SET_STATS, payload: response.data });
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

export const useGoals = () => {
  const context = useContext(GoalsContext);
  if (!context) throw new Error('useGoals must be used within a GoalsProvider');
  return context;
};

// ─────────────────────────────────────────────
// UI CONTEXT
// ─────────────────────────────────────────────

const uiInitialState = {
  activePage:       'dashboard',
  sidebarCollapsed: false,
  toasts:           [],
  activeModal:      null,
  activeGoalId:     null
};

const SET_ACTIVE_PAGE    = 'SET_ACTIVE_PAGE';
const TOGGLE_SIDEBAR     = 'TOGGLE_SIDEBAR';
const ADD_TOAST          = 'ADD_TOAST';
const REMOVE_TOAST       = 'REMOVE_TOAST';
const OPEN_MODAL         = 'OPEN_MODAL';
const CLOSE_MODAL        = 'CLOSE_MODAL';

const uiReducer = (state, action) => {
  switch (action.type) {
    case SET_ACTIVE_PAGE:
      return { ...state, activePage: action.payload };
    case TOGGLE_SIDEBAR:
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    case ADD_TOAST:
      return { ...state, toasts: [...state.toasts, action.payload] };
    case REMOVE_TOAST:
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.payload) };
    case OPEN_MODAL:
      return { ...state, activeModal: action.payload.modal, activeGoalId: action.payload.goalId ?? null };
    case CLOSE_MODAL:
      return { ...state, activeModal: null, activeGoalId: null };
    default:
      return state;
  }
};

const UIContext = createContext(null);

export const UIProvider = ({ children }) => {
  const [state, dispatch] = useReducer(uiReducer, uiInitialState);

  const setActivePage   = (page)  => dispatch({ type: SET_ACTIVE_PAGE, payload: page });
  const toggleSidebar   = ()      => dispatch({ type: TOGGLE_SIDEBAR });
  const openModal       = (modal, meta = {}) =>
    dispatch({ type: OPEN_MODAL, payload: { modal, goalId: meta.goalId } });
  const closeModal      = ()      => dispatch({ type: CLOSE_MODAL });

  const addToast = (message, type = 'info') => {
    const id = Date.now().toString();
    dispatch({ type: ADD_TOAST, payload: { id, message, type } });
    setTimeout(() => dispatch({ type: REMOVE_TOAST, payload: id }), 4000);
  };

  const removeToast = (id) => dispatch({ type: REMOVE_TOAST, payload: id });

  const value = {
    ...state,
    setActivePage,
    toggleSidebar,
    addToast,
    removeToast,
    openModal,
    closeModal
  };

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) throw new Error('useUI must be used within a UIProvider');
  return context;
};

export default GoalsContext;