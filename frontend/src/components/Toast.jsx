import { useEffect } from 'react';
import { useUI } from '../contexts';
import '../styles/variables.css';

export default function Toast() {
  const { toasts, removeToast } = useUI();

  useEffect(() => {
    toasts.forEach(toast => {
      const timer = setTimeout(() => {
        removeToast(toast.id);
      }, 4000);

      return () => clearTimeout(timer);
    });
  }, [toasts, removeToast]);

  const getToastColor = (type) => {
    const colors = {
      success: 'var(--status-completed)',
      error: 'var(--priority-critical)',
      warning: 'var(--priority-high)',
      info: 'var(--status-active)'
    };
    return colors[type] || 'var(--text)';
  };

  const getToastIcon = (type) => {
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };
    return icons[type] || 'ℹ';
  };

  return (
    <div 
      className="toast-container"
      style={{
        position: 'fixed',
        top: 'var(--spacing-4)',
        right: 'var(--spacing-4)',
        zIndex: 'var(--z-toast)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-2)'
      }}
    >
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="toast-item"
          style={{
            background: 'var(--surface)',
            border: `2px solid ${getToastColor(toast.type)}`,
            borderRadius: 'var(--radius)',
            padding: 'var(--spacing-3)',
            boxShadow: 'var(--shadow-md)',
            minWidth: '300px',
            maxWidth: '400px',
            animation: 'slideIn 0.3s ease-out',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-2)'
          }}
        >
          <div 
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: getToastColor(toast.type),
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'var(--font-sm)',
              fontWeight: 'bold',
              flexShrink: 0
            }}
          >
            {getToastIcon(toast.type)}
          </div>
          
          <div style={{ flex: 1 }}>
            <div 
              style={{
                fontSize: 'var(--font-base)',
                fontWeight: 'bold',
                color: 'var(--text)',
                marginBottom: 'var(--spacing-1)'
              }}
            >
              {toast.type.charAt(0).toUpperCase() + toast.type.slice(1)}
            </div>
            <div 
              style={{
                fontSize: 'var(--font-sm)',
                color: 'var(--text-muted)',
                lineHeight: '1.4'
              }}
            >
              {toast.message}
            </div>
          </div>
          
          <button
            onClick={() => removeToast(toast.id)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: 'var(--font-lg)',
              cursor: 'pointer',
              padding: 'var(--spacing-1)',
              borderRadius: 'var(--radius)',
              transition: 'var(--transition-fast)'
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

// Add CSS animation
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    .toast-item {
      animation: slideIn 0.3s ease-out;
    }
  `;
  document.head.appendChild(style);
}
