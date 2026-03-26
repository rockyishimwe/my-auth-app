import '../styles/variables.css';

export default function LoadingState({ type = 'default' }) {
  if (type === 'skeleton') {
    return (
      <div className="flex-col" style={{ gap: 'var(--spacing-3)' }}>
        {[1, 2, 3].map(item => (
          <div 
            key={item}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: 'var(--spacing-4)',
              boxShadow: 'var(--shadow)'
            }}
          >
            <div 
              style={{
                height: '20px',
                background: 'var(--border)',
                borderRadius: '4px',
                marginBottom: 'var(--spacing-2)',
                animation: 'pulse 1.5s ease-in-out infinite'
              }}
            />
            <div 
              style={{
                height: '16px',
                background: 'var(--border)',
                borderRadius: '4px',
                width: '80%',
                marginBottom: 'var(--spacing-2)',
                animation: 'pulse 1.5s ease-in-out infinite'
              }}
            />
            <div 
              style={{
                height: '12px',
                background: 'var(--border)',
                borderRadius: '4px',
                width: '60%',
                animation: 'pulse 1.5s ease-in-out infinite'
              }}
            />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'spinner') {
    return (
      <div 
        className="flex-center"
        style={{
          height: '100vh',
          background: 'var(--bg)'
        }}
      >
        <div 
          style={{
            width: '40px',
            height: '40px',
            border: '3px solid var(--border)',
            borderTop: '3px solid var(--work)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}
        />
      </div>
    );
  }

  // Default loading state
  return (
    <div 
      className="flex-center"
      style={{
        height: '200px',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow)'
      }}
    >
      <div className="flex-col" style={{ alignItems: 'center', gap: 'var(--spacing-2)' }}>
        <div 
          style={{
            width: '32px',
            height: '32px',
            border: '2px solid var(--border)',
            borderTop: '2px solid var(--work)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}
        />
        <span style={{ fontSize: 'var(--font-base)', color: 'var(--text-muted)' }}>
          Loading...
        </span>
      </div>
    </div>
  );
}

// Add CSS animations
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}
