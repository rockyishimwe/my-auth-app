import '../styles/variables.css';

export default function EmptyState({ title, message, icon = '📋', action = null }) {
  return (
    <div 
      className="flex-col"
      style={{
        textAlign: 'center',
        padding: 'var(--spacing-7)',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow)'
      }}
    >
      <div 
        style={{
          fontSize: '4rem',
          marginBottom: 'var(--spacing-4)',
          opacity: 0.5
        }}
      >
        {icon}
      </div>
      
      <h2 
        style={{
          fontSize: 'var(--font-xl)',
          fontWeight: 'bold',
          color: 'var(--text)',
          margin: '0 0 var(--spacing-2) 0'
        }}
      >
        {title}
      </h2>
      
      <p 
        style={{
          fontSize: 'var(--font-base)',
          color: 'var(--text-muted)',
          margin: '0 0 var(--spacing-4) 0',
          lineHeight: '1.5'
        }}
      >
        {message}
      </p>
      
      {action && (
        <button
          onClick={action.onClick}
          style={{
            background: 'var(--work)',
            color: 'white',
            border: 'none',
            padding: 'var(--spacing-3) var(--spacing-5)',
            borderRadius: 'var(--radius)',
            fontSize: 'var(--font-base)',
            cursor: 'pointer',
            transition: 'var(--transition-fast)'
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
