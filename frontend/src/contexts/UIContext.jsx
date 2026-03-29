import { createContext, useContext, useReducer, useCallback } from 'react';

// ─────────────────────────────────────────────
// UI CONTEXT
// ─────────────────────────────────────────────

const UIContext = createContext();

const initialState = {
  activePage: 'dashboard',
  sidebarCollapsed: window.innerWidth < 768,
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

const uiReducer = (state, action) => {
  switch (action.type) {
    case SET_PAGE:
      return { ...state, activePage: action.payload };
    case TOGGLE_SIDEBAR:
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    case ADD_TOAST:
      return { ...state, toasts: [...state.toasts, action.payload] };
    case REMOVE_TOAST:
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.payload) };
    case OPEN_MODAL:
      return { ...state, activeModal: action.payload };
    case CLOSE_MODAL:
      return { ...state, activeModal: null };
    case SET_ACTIVE_GOAL:
      return { ...state, activeGoalId: action.payload };
    default:
      return state;
  }
};

// Provider component
export const UIProvider = ({ children }) => {
  const [state, dispatch] = useReducer(uiReducer, initialState);

  const setPage = useCallback((page) => dispatch({ type: SET_PAGE, payload: page }), []);
  const toggleSidebar = useCallback(() => dispatch({ type: TOGGLE_SIDEBAR }), []);
  
  const addToast = useCallback((message, type = 'info', autoClose = true) => {
    const id = Date.now();
    dispatch({ type: ADD_TOAST, payload: { id, message, type } });
    if (autoClose) {
      setTimeout(() => {
        dispatch({ type: REMOVE_TOAST, payload: id });
      }, 4000);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => dispatch({ type: REMOVE_TOAST, payload: id }), []);
  const openModal = useCallback((modalName) => dispatch({ type: OPEN_MODAL, payload: modalName }), []);
  const closeModal = useCallback(() => dispatch({ type: CLOSE_MODAL }), []);
  const setActiveGoal = useCallback((goalId) => dispatch({ type: SET_ACTIVE_GOAL, payload: goalId }), []);

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

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

// Hook
export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within UIProvider');
  }
  return context;
};
