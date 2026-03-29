import { useUI } from '../contexts/GoalsContext';
import '../styles/variables.css';

export default function GoalCard({ goal, onUpdate, onDelete }) {
  const { openModal } = useUI();

  const getContextColor = (context) => {
    const colors = {
      work: 'var(--work)',
      health: 'var(--health)',
      finance: 'var(--finance)',
      education: 'var(--education)',
      personal: 'var(--personal)',
      relationships: 'var(--relationships)',
      creativity: 'var(--creativity)',
      travel: 'var(--travel)'
    };
    return colors[context] || 'var(--text)';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'var(--priority-low)',
      medium: 'var(--priority-medium)',
      high: 'var(--priority-high)',
      critical: 'var(--priority-critical)'
    };
    return colors[priority] || 'var(--text)';
  };

  const getStatusColor = (status) => {
    const colors = {
      'active': 'var(--status-active)',
      'in-progress': 'var(--status-in-progress)',
      completed: 'var(--status-completed)',
      archived: 'var(--status-archived)'
    };
    return colors[status] || 'var(--text)';
  };

  const handleEdit = () => {
    // For now, just show a simple alert. In a real app, this would open an edit modal/form
    const newTitle = prompt('Edit goal title:', goal.title);
    if (newTitle && newTitle !== goal.title) {
      onUpdate(goal._id, { title: newTitle });
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${goal.title}"?`)) {
      onDelete(goal._id);
    }
  };

  const daysUntilDue = () => {
    if (!goal.dueDate) return null;
    
    const dueDate = new Date(goal.dueDate);
    const today = new Date();
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `${diffDays} days`;
  };

  return (
    <div 
      className="goal-card"
      style={{
        background: 'var(--surface)',
        border: `2px solid ${getContextColor(goal.context)}`,
        borderRadius: 'var(--radius)',
        padding: 'var(--spacing-4)',
        boxShadow: 'var(--shadow)',
        transition: 'var(--transition-fast)',
        cursor: 'pointer'
      }}
      onClick={handleEdit}
    >
      <div className="flex-between" style={{ marginBottom: 'var(--spacing-2)' }}>
        <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 'bold', margin: 0, color: 'var(--text)' }}>
          {goal.title}
        </h3>
        
        <div className="flex" style={{ gap: 'var(--spacing-1)' }}>
          <span 
            style={{
              background: getContextColor(goal.context),
              color: 'white',
              padding: 'var(--spacing-1) var(--spacing-2)',
              borderRadius: 'var(--radius)',
              fontSize: 'var(--font-xs)',
              fontWeight: 'bold',
              textTransform: 'uppercase'
            }}
          >
            {goal.context}
          </span>
          
          <span 
            style={{
              background: getPriorityColor(goal.priority),
              color: 'white',
              padding: 'var(--spacing-1) var(--spacing-2)',
              borderRadius: 'var(--radius)',
              fontSize: 'var(--font-xs)',
              fontWeight: 'bold',
              textTransform: 'uppercase'
            }}
          >
            {goal.priority}
          </span>
        </div>
      </div>

      {goal.description && (
        <p style={{ 
          color: 'var(--text-muted)', 
          fontSize: 'var(--font-base)', 
          margin: '0 0 var(--spacing-2) 0',
          lineHeight: '1.4'
        }}>
          {goal.description}
        </p>
      )}

      <div className="flex-between" style={{ marginBottom: 'var(--spacing-2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
          <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>Progress:</span>
          <div style={{ flex: 1, height: '8px', background: 'var(--border)', borderRadius: '4px' }}>
            <div 
              style={{
                width: `${goal.progress}%`,
                height: '100%',
                background: getStatusColor(goal.status),
                borderRadius: '4px',
                transition: 'var(--transition-normal)'
              }}
            />
          </div>
          <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text)', fontWeight: 'bold' }}>
            {goal.progress}%
          </span>
        </div>

        <div className="flex" style={{ gap: 'var(--spacing-2)' }}>
          {goal.milestones && goal.milestones.length > 0 && (
            <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>
              {goal.milestones.filter(m => m.completed).length}/{goal.milestones.length} milestones
            </span>
          )}
          
          {goal.notes && goal.notes.length > 0 && (
            <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>
              {goal.notes.length} notes
            </span>
          )}
        </div>
      </div>

      {goal.dueDate && (
        <div className="flex-between" style={{ marginBottom: 'var(--spacing-2)' }}>
          <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>Due:</span>
          <span 
            style={{
              fontSize: 'var(--font-sm)', 
              color: daysUntilDue() === 'Overdue' ? 'var(--priority-critical)' : 'var(--text)',
              fontWeight: 'bold'
            }}
          >
            {new Date(goal.dueDate).toLocaleDateString()}
          </span>
          {daysUntilDue() && (
            <span 
              style={{
                fontSize: 'var(--font-xs)', 
                color: daysUntilDue() === 'Overdue' ? 'var(--priority-critical)' : 'var(--text-muted)',
                background: daysUntilDue() === 'Overdue' ? 'var(--priority-critical)' : 'var(--bg)',
                padding: 'var(--spacing-1) var(--spacing-2)',
                borderRadius: 'var(--radius)'
              }}
            >
              {daysUntilDue()}
            </span>
          )}
        </div>
      )}

      {goal.tags && goal.tags.length > 0 && (
        <div style={{ marginBottom: 'var(--spacing-2)' }}>
          <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)', marginRight: 'var(--spacing-1)' }}>
            Tags:
          </span>
          <div className="flex" style={{ gap: 'var(--spacing-1)', flexWrap: 'wrap' }}>
            {goal.tags.map(tag => (
              <span 
                key={tag}
                style={{
                  background: 'var(--bg)',
                  color: 'var(--text)',
                  padding: 'var(--spacing-1) var(--spacing-2)',
                  borderRadius: 'var(--radius)',
                  fontSize: 'var(--font-xs)',
                  border: '1px solid var(--border)'
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex" style={{ gap: 'var(--spacing-2)' }}>
        <button 
          onClick={(e) => { e.stopPropagation(); handleEdit(); }}
          style={{
            background: 'var(--work)',
            color: 'white',
            border: 'none',
            padding: 'var(--spacing-2) var(--spacing-3)',
            borderRadius: 'var(--radius)',
            fontSize: 'var(--font-base)',
            cursor: 'pointer',
            transition: 'var(--transition-fast)'
          }}
        >
          Edit
        </button>
        
        <button 
          onClick={(e) => { e.stopPropagation(); handleDelete(); }}
          style={{
            background: 'var(--surface)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            padding: 'var(--spacing-2) var(--spacing-3)',
            borderRadius: 'var(--radius)',
            fontSize: 'var(--font-base)',
            cursor: 'pointer',
            transition: 'var(--transition-fast)'
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
