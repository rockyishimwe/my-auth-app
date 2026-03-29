import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useUI } from '../contexts/GoalsContext';
import '../styles/variables.css';

export default function GoalTable({ goals, onUpdate, onDelete, selectedGoals, onSelectionChange }) {
  const { addToast } = useUI();
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  const handleSort = (field) => {
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
  };

  const sortedGoals = [...goals].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    // Handle string comparison
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSelectAll = (checked) => {
    const allIds = goals.map(goal => goal._id);
    onSelectionChange(checked ? allIds : []);
  };

  const handleSelectGoal = (goalId, checked) => {
    if (checked) {
      onSelectionChange([...selectedGoals, goalId]);
    } else {
      onSelectionChange(selectedGoals.filter(id => id !== goalId));
    }
  };

  const handleBulkAction = async (action) => {
    try {
      for (const goalId of selectedGoals) {
        if (action === 'complete') {
          await onUpdate(goalId, { status: 'completed' });
        } else if (action === 'archive') {
          await onUpdate(goalId, { status: 'archived' });
        } else if (action === 'delete') {
          await onDelete(goalId);
        }
      }
      onSelectionChange([]);
      addToast('success', `${action} ${selectedGoals.length} goals successfully`);
    } catch (error) {
      addToast('error', `Failed to ${action} goals`);
    }
  };

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

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      boxShadow: 'var(--shadow-md)',
      overflow: 'hidden'
    }}>
      {/* Bulk actions */}
      {selectedGoals.length > 0 && (
        <div style={{
          background: 'var(--bg)',
          padding: 'var(--spacing-3)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-2)'
        }}>
          <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text)' }}>
            {selectedGoals.length} selected
          </span>
          <button
            onClick={() => handleBulkAction('complete')}
            style={{
              background: 'var(--status-completed)',
              color: 'white',
              border: 'none',
              padding: 'var(--spacing-1) var(--spacing-2)',
              borderRadius: 'var(--radius)',
              fontSize: 'var(--font-sm)',
              cursor: 'pointer'
            }}
          >
            Complete
          </button>
          <button
            onClick={() => handleBulkAction('archive')}
            style={{
              background: 'var(--status-archived)',
              color: 'white',
              border: 'none',
              padding: 'var(--spacing-1) var(--spacing-2)',
              borderRadius: 'var(--radius)',
              fontSize: 'var(--font-sm)',
              cursor: 'pointer'
            }}
          >
            <Icon icon="solar:archive-bold" width={14} height={14} style={{ marginRight: 'var(--spacing-1)' }} />
            Archive
          </button>
          <button
            onClick={() => handleBulkAction('delete')}
            style={{
              background: 'var(--priority-critical)',
              color: 'white',
              border: 'none',
              padding: 'var(--spacing-1) var(--spacing-2)',
              borderRadius: 'var(--radius)',
              fontSize: 'var(--font-sm)',
              cursor: 'pointer'
            }}
          >
            <Icon icon="solar:trash-bin-trash-bold" width={14} height={14} style={{ marginRight: 'var(--spacing-1)' }} />
            Delete
          </button>
        </div>
      )}

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg)' }}>
              <th style={{ 
                padding: 'var(--spacing-3)', 
                textAlign: 'left',
                fontWeight: 'bold',
                fontSize: 'var(--font-sm)',
                color: 'var(--text)',
                borderBottom: '1px solid var(--border)'
              }}>
                <input
                  type="checkbox"
                  checked={selectedGoals.length === goals.length && goals.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  style={{ marginRight: 'var(--spacing-2)' }}
                />
              </th>
              <th style={{ 
                padding: 'var(--spacing-3)', 
                textAlign: 'left',
                fontWeight: 'bold',
                fontSize: 'var(--font-sm)',
                color: 'var(--text)',
                borderBottom: '1px solid var(--border)',
                cursor: 'pointer'
              }} onClick={() => handleSort('title')}>
                Title {sortField === 'title' && (
                  <Icon 
                    icon={sortDirection === 'asc' ? 'solar:arrow-up-bold' : 'solar:arrow-down-bold'} 
                    width={14} 
                    height={14} 
                    style={{ marginLeft: 'var(--spacing-1)' }} 
                  />
                )}
              </th>
              <th style={{ 
                padding: 'var(--spacing-3)', 
                textAlign: 'left',
                fontWeight: 'bold',
                fontSize: 'var(--font-sm)',
                color: 'var(--text)',
                borderBottom: '1px solid var(--border)',
                cursor: 'pointer'
              }} onClick={() => handleSort('context')}>
                Context {sortField === 'context' && (
                  <Icon 
                    icon={sortDirection === 'asc' ? 'solar:arrow-up-bold' : 'solar:arrow-down-bold'} 
                    width={14} 
                    height={14} 
                    style={{ marginLeft: 'var(--spacing-1)' }} 
                  />
                )}
              </th>
              <th style={{ 
                padding: 'var(--spacing-3)', 
                textAlign: 'left',
                fontWeight: 'bold',
                fontSize: 'var(--font-sm)',
                color: 'var(--text)',
                borderBottom: '1px solid var(--border)',
                cursor: 'pointer'
              }} onClick={() => handleSort('priority')}>
                Priority {sortField === 'priority' && (
                  <Icon 
                    icon={sortDirection === 'asc' ? 'solar:arrow-up-bold' : 'solar:arrow-down-bold'} 
                    width={14} 
                    height={14} 
                    style={{ marginLeft: 'var(--spacing-1)' }} 
                  />
                )}
              </th>
              <th style={{ 
                padding: 'var(--spacing-3)', 
                textAlign: 'left',
                fontWeight: 'bold',
                fontSize: 'var(--font-sm)',
                color: 'var(--text)',
                borderBottom: '1px solid var(--border)',
                cursor: 'pointer'
              }} onClick={() => handleSort('status')}>
                Status {sortField === 'status' && (
                  <Icon 
                    icon={sortDirection === 'asc' ? 'solar:arrow-up-bold' : 'solar:arrow-down-bold'} 
                    width={14} 
                    height={14} 
                    style={{ marginLeft: 'var(--spacing-1)' }} 
                  />
                )}
              </th>
              <th style={{ 
                padding: 'var(--spacing-3)', 
                textAlign: 'left',
                fontWeight: 'bold',
                fontSize: 'var(--font-sm)',
                color: 'var(--text)',
                borderBottom: '1px solid var(--border)',
                cursor: 'pointer'
              }} onClick={() => handleSort('progress')}>
                Progress {sortField === 'progress' && (
                  <Icon 
                    icon={sortDirection === 'asc' ? 'solar:arrow-up-bold' : 'solar:arrow-down-bold'} 
                    width={14} 
                    height={14} 
                    style={{ marginLeft: 'var(--spacing-1)' }} 
                  />
                )}
              </th>
              <th style={{ 
                padding: 'var(--spacing-3)', 
                textAlign: 'left',
                fontWeight: 'bold',
                fontSize: 'var(--font-sm)',
                color: 'var(--text)',
                borderBottom: '1px solid var(--border)',
                cursor: 'pointer'
              }} onClick={() => handleSort('dueDate')}>
                Due Date {sortField === 'dueDate' && (
                  <Icon 
                    icon={sortDirection === 'asc' ? 'solar:arrow-up-bold' : 'solar:arrow-down-bold'} 
                    width={14} 
                    height={14} 
                    style={{ marginLeft: 'var(--spacing-1)' }} 
                  />
                )}
              </th>
              <th style={{ 
                padding: 'var(--spacing-3)', 
                textAlign: 'left',
                fontWeight: 'bold',
                fontSize: 'var(--font-sm)',
                color: 'var(--text)',
                borderBottom: '1px solid var(--border)'
              }}>
                <span key="actions-header">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedGoals.map((goal) => (
              <tr key={goal._id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: 'var(--spacing-3)' }}>
                  <input
                    type="checkbox"
                    checked={selectedGoals.includes(goal._id)}
                    onChange={(e) => handleSelectGoal(goal._id, e.target.checked)}
                  />
                </td>
                <td style={{ padding: 'var(--spacing-3)' }}>
                  <div style={{ fontSize: 'var(--font-base)', color: 'var(--text)' }}>
                    {goal.title}
                  </div>
                  {goal.description && (
                    <div style={{ 
                      fontSize: 'var(--font-sm)', 
                      color: 'var(--text-muted)',
                      marginTop: 'var(--spacing-1)'
                    }}>
                      {goal.description.substring(0, 100)}...
                    </div>
                  )}
                </td>
                <td style={{ padding: 'var(--spacing-3)' }}>
                  <span style={{
                    background: getContextColor(goal.context),
                    color: 'white',
                    padding: 'var(--spacing-1) var(--spacing-2)',
                    borderRadius: 'var(--radius)',
                    fontSize: 'var(--font-xs)',
                    textTransform: 'uppercase',
                    fontWeight: 'bold'
                  }}>
                    {goal.context}
                  </span>
                </td>
                <td style={{ padding: 'var(--spacing-3)' }}>
                  <span style={{
                    background: getPriorityColor(goal.priority),
                    color: 'white',
                    padding: 'var(--spacing-1) var(--spacing-2)',
                    borderRadius: 'var(--radius)',
                    fontSize: 'var(--font-xs)',
                    textTransform: 'uppercase',
                    fontWeight: 'bold'
                  }}>
                    {goal.priority}
                  </span>
                </td>
                <td style={{ padding: 'var(--spacing-3)' }}>
                  <span style={{
                    background: getStatusColor(goal.status),
                    color: 'white',
                    padding: 'var(--spacing-1) var(--spacing-2)',
                    borderRadius: 'var(--radius)',
                    fontSize: 'var(--font-xs)',
                    textTransform: 'uppercase',
                    fontWeight: 'bold'
                  }}>
                    {goal.status}
                  </span>
                </td>
                <td style={{ padding: 'var(--spacing-3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                    <div style={{ 
                      flex: 1, 
                      height: '8px', 
                      background: 'var(--border)', 
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div 
                        style={{
                          width: `${goal.progress}%`,
                          height: '100%',
                          background: getStatusColor(goal.status),
                          borderRadius: '4px'
                        }}
                      />
                    </div>
                    <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text)' }}>
                      {goal.progress}%
                    </span>
                  </div>
                </td>
                <td style={{ padding: 'var(--spacing-3)' }}>
                  {goal.dueDate ? new Date(goal.dueDate).toLocaleDateString() : '-'}
                </td>
                <td style={{ padding: 'var(--spacing-3)' }}>
                  <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                    <button
                      onClick={() => onUpdate(goal._id, goal)}
                      style={{
                        background: 'var(--work)',
                        color: 'white',
                        border: 'none',
                        padding: 'var(--spacing-1) var(--spacing-2)',
                        borderRadius: 'var(--radius)',
                        fontSize: 'var(--font-sm)',
                        cursor: 'pointer'
                      }}
                    >
                      <Icon icon="solar:pen-bold" width={14} height={14} />
                    </button>
                    <button
                      onClick={() => onDelete(goal._id)}
                      style={{
                        background: 'var(--priority-critical)',
                        color: 'white',
                        border: 'none',
                        padding: 'var(--spacing-1) var(--spacing-2)',
                        borderRadius: 'var(--radius)',
                        fontSize: 'var(--font-sm)',
                        cursor: 'pointer'
                      }}
                    >
                      <Icon icon="solar:trash-bin-trash-bold" width={14} height={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {goals.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: 'var(--spacing-7)', 
          color: 'var(--text-muted)',
          fontSize: 'var(--font-base)'
        }}>
          No goals found. Try adjusting your filters or create a new goal.
        </div>
      )}
    </div>
  );
}
