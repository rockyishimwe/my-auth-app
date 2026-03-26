/**
 * Keyboard Shortcuts Utility
 */

const shortcuts = new Map();

/**
 * Register a keyboard shortcut
 */
export const registerShortcut = (key, handler, options = {}) => {
  const {
    ctrl = false,
    shift = false,
    alt = false,
    preventDefault = true
  } = options;

  const shortcutKey = `${ctrl ? 'ctrl+' : ''}${shift ? 'shift+' : ''}${alt ? 'alt+' : ''}${key.toLowerCase()}`;
  
  shortcuts.set(shortcutKey, {
    handler,
    preventDefault,
    ctrl,
    shift,
    alt
  });
};

/**
 * Unregister a keyboard shortcut
 */
export const unregisterShortcut = (key, options = {}) => {
  const {
    ctrl = false,
    shift = false,
    alt = false
  } = options;

  const shortcutKey = `${ctrl ? 'ctrl+' : ''}${shift ? 'shift+' : ''}${alt ? 'alt+' : ''}${key.toLowerCase()}`;
  shortcuts.delete(shortcutKey);
};

/**
 * Handle keyboard events
 */
const handleKeyDown = (event) => {
  const key = event.key.toLowerCase();
  const ctrl = event.ctrlKey || event.metaKey;
  const shift = event.shiftKey;
  const alt = event.altKey;

  // Build the shortcut key
  const shortcutKey = `${ctrl ? 'ctrl+' : ''}${shift ? 'shift+' : ''}${alt ? 'alt+' : ''}${key}`;

  // Find matching shortcut
  const shortcut = shortcuts.get(shortcutKey);
  if (shortcut) {
    if (shortcut.preventDefault) {
      event.preventDefault();
    }
    shortcut.handler(event);
  }
};

/**
 * Initialize keyboard shortcuts
 */
export const initKeyboardShortcuts = () => {
  document.addEventListener('keydown', handleKeyDown);
};

/**
 * Cleanup keyboard shortcuts
 */
export const cleanupKeyboardShortcuts = () => {
  document.removeEventListener('keydown', handleKeyDown);
  shortcuts.clear();
};

// Default shortcuts for GoalOS
export const registerDefaultShortcuts = (actions) => {
  // N - New goal
  registerShortcut('n', actions.openNewGoalModal, { ctrl: true });
  
  // / - Focus search
  registerShortcut('/', actions.focusSearch);
  
  // ESC - Close modal/panel
  registerShortcut('escape', actions.closeModal);
  
  // G - Go to goals
  registerShortcut('g', actions.goToGoals, { ctrl: true });
  
  // D - Go to dashboard
  registerShortcut('d', actions.goToDashboard, { ctrl: true });
  
  // A - Go to analytics
  registerShortcut('a', actions.goToAnalytics, { ctrl: true });
  
  // S - Go to settings
  registerShortcut('s', actions.goToSettings, { ctrl: true });
  
  // ? - Show keyboard shortcuts help
  registerShortcut('?', actions.showHelp);
};

// Help text for keyboard shortcuts
export const getShortcutHelp = () => {
  return [
    { key: 'Ctrl + N', description: 'Create new goal' },
    { key: '/', description: 'Focus search' },
    { key: 'Escape', description: 'Close modal/panel' },
    { key: 'Ctrl + G', description: 'Go to Goals' },
    { key: 'Ctrl + D', description: 'Go to Dashboard' },
    { key: 'Ctrl + A', description: 'Go to Analytics' },
    { key: 'Ctrl + S', description: 'Go to Settings' },
    { key: '?', description: 'Show keyboard shortcuts' }
  ];
};
