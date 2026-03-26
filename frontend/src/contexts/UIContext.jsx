import { createContext, useContext, useReducer } from 'react';

// Initial state
const initialState = {
  activePage: 'dashboard',
  sidebarCollapsed: false,
  toasts: [],
  activeModal: null,
  activeGoalId: null
};

// Action types
const SET_PAGE = 'SET_PAGE';
const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR';
const ADD_TOAST = 'ADD_TOAST';
const REMOVE_TOAST = 'REMOVE_TOAST';
const OPEN_MODAL = 'OPEN_MODAL';
const CLOSE_MODAL = 'CLOSE_MODAL';
const SET_ACTIVE_GOAL = 'SET_ACTIVE_GOAL';

// Reducer
const uiReducer = (state, action) => {
  switch (action.type) {
    case SET_PAGE:
      return {
        ...state,
        activePage: action.payload
      };
    
    case TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarCollapsed: !state.sidebarCollapsed
      };
    
    case ADD_TOAST:
      return {
        ...state,
        toasts: [...state.toasts, {
          id: Date.now(),
          type: action.payload.type,
          message: action.payload.message
        }]
      };
    
    case REMOVE_TOAST:
      return {
        ...state,
        toasts: state.toasts.filter(toast => toast.id !== action.payload)
      };
    
    case OPEN_MODAL:
      return {
        ...state,
        activeModal: action.payload
      };
    
    case CLOSE_MODAL:
      return {
        ...state,
        activeModal: null
      };
    
    case SET_ACTIVE_GOAL:
      return {
        ...state,
        activeGoalId: action.payload
      };
    
    default:
      return state;
  }
};

// Create context
const UIContext = createContext(null);

// Provider component
export const UIProvider = ({ children }) => {
  const [state, dispatch] = useReducer(uiReducer, initialState);

  // Actions
  const setPage = (page) => {
    dispatch({ type: SET_PAGE, payload: page });
  };

  const toggleSidebar = () => {
    dispatch({ type: TOGGLE_SIDEBAR });
  };

  const addToast = (type, message) => {
    dispatch({ type: ADD_TOAST, payload: { type, message } });
  };

  const removeToast = (id) => {
    dispatch({ type: REMOVE_TOAST, payload: id });
  };

  const openModal = (modalType, data = null) => {
    dispatch({ type: OPEN_MODAL, payload: { type: modalType, data } });
  };

  const closeModal = () => {
    dispatch({ type: CLOSE_MODAL });
  };

  const setActiveGoal = (goalId) => {
    dispatch({ type: SET_ACTIVE_GOAL, payload: goalId });
  };

  const value = {
    ...state,
    setPage,
    toggleSidebar,
    addToast,
    removeToast,
    openModal,
    closeModal,
    setActiveGoal
  };

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
};

// Custom hook
export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};

export default UIContext;
