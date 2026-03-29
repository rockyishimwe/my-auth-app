import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useGoals, useUI } from '../contexts/GoalsContext';
import GoalCard from '../components/GoalCard';
import GoalTable from '../components/GoalTable';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import '../styles/variables.css';

export default function GoalsListPage() {
  const { goals, fetchGoals, createGoal, updateGoal, deleteGoal, filters, setFilters, loading, error } = useGoals();
  const { addToast } = useUI();
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleCreateGoal = async (goalData) => {
    try {
      await createGoal(goalData);
      addToast('success', 'Goal created successfully');
      setShowCreateModal(false);
    } catch (error) {
      addToast('error', error.message);
    }
  };

  const handleUpdateGoal = async (id, goalData) => {
    try {
      await updateGoal(id, goalData);
      addToast('success', 'Goal updated successfully');
    } catch (error) {
      addToast('error', error.message);
    }
  };

  const handleDeleteGoal = async (id) => {
    try {
      await deleteGoal(id);
      addToast('success', 'Goal deleted successfully');
    } catch (error) {
      addToast('error', error.message);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters({ [filterType]: value });
  };

  const filteredGoals = goals.filter(goal => {
    if (filters.context && goal.context !== filters.context) return false;
    if (filters.status && goal.status !== filters.status) return false;
    if (filters.priority && goal.priority !== filters.priority) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return !goal.title.toLowerCase().includes(searchLower) &&
             !goal.description?.toLowerCase().includes(searchLower) &&
             !goal.tags?.some(tag => tag.toLowerCase().includes(searchLower));
    }
    return true;
  });

  const handleBulkAction = async (action) => {
    try {
      for (const goalId of selectedGoals) {
        if (action === 'complete') {
          await updateGoal(goalId, { status: 'completed' });
        } else if (action === 'archive') {
          await updateGoal(goalId, { status: 'archived' });
        } else if (action === 'delete') {
          await deleteGoal(goalId);
        }
      }
      setSelectedGoals([]);
      addToast('success', `${action} ${selectedGoals.length} goals successfully`);
    } catch (error) {
      addToast('error', `Failed to ${action} goals`);
    }
  };

  return (
    <div className="container">
      <header style={{ marginBottom: 'var(--spacing-5)' }}>
        <div className="flex-between" style={{ marginBottom: 'var(--spacing-4)' }}>
          <h1 style={{ fontSize: 'var(--font-3xl)', fontWeight: 'bold', margin: 0 }}>
            Goals
          </h1>
          
          <div className="flex" style={{ gap: 'var(--spacing-2)' }}>
            <button
              onClick={() => setShowCreateModal(true)}
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
              <Icon icon="solar:add-circle-bold" width={18} height={18} style={{ marginRight: 'var(--spacing-2)' }} />
              New Goal
            </button>
            
            <div className="flex" style={{ gap: 'var(--spacing-1)' }}>
              <button
                onClick={() => setViewMode('cards')}
                style={{
                  background: viewMode === 'cards' ? 'var(--work)' : 'var(--surface)',
                  color: viewMode === 'cards' ? 'white' : 'var(--text)',
                  border: '1px solid var(--border)',
                  padding: 'var(--spacing-2)',
                  borderRadius: 'var(--radius)',
                  fontSize: 'var(--font-base)',
                  cursor: 'pointer'
                }}
              >
                <Icon icon="solar:widget-bold" width={16} height={16} />
                Cards
              </button>
              <button
                onClick={() => setViewMode('table')}
                style={{
                  background: viewMode === 'table' ? 'var(--work)' : 'var(--surface)',
                  color: viewMode === 'table' ? 'white' : 'var(--text)',
                  border: '1px solid var(--border)',
                  padding: 'var(--spacing-2)',
                  borderRadius: 'var(--radius)',
                  fontSize: 'var(--font-base)',
                  cursor: 'pointer'
                }}
              >
                <Icon icon="solar:table-bold" width={16} height={16} />
                Table
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex" style={{ gap: 'var(--spacing-3)', flexWrap: 'wrap' }}>
          <select 
            value={filters.context}
            onChange={(e) => handleFilterChange('context', e.target.value)}
            style={{
              padding: 'var(--spacing-2)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              background: 'var(--surface)',
              fontSize: 'var(--font-base)'
            }}
          >
            <option value="">All Contexts</option>
            <option key="work" value="work">Work</option>
            <option key="health" value="health">Health</option>
            <option key="finance" value="finance">Finance</option>
            <option key="education" value="education">Education</option>
            <option key="personal" value="personal">Personal</option>
            <option key="relationships" value="relationships">Relationships</option>
            <option key="creativity" value="creativity">Creativity</option>
            <option key="travel" value="travel">Travel</option>
          </select>

          <select 
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            style={{
              padding: 'var(--spacing-2)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              background: 'var(--surface)',
              fontSize: 'var(--font-base)'
            }}
          >
            <option value="">All Status</option>
            <option key="active" value="active">Active</option>
            <option key="in-progress" value="in-progress">In Progress</option>
            <option key="completed" value="completed">Completed</option>
            <option key="archived" value="archived">Archived</option>
          </select>

          <select 
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            style={{
              padding: 'var(--spacing-2)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              background: 'var(--surface)',
              fontSize: 'var(--font-base)'
            }}
          >
            <option value="">All Priorities</option>
            <option key="low" value="low">Low</option>
            <option key="medium" value="medium">Medium</option>
            <option key="high" value="high">High</option>
            <option key="critical" value="critical">Critical</option>
          </select>

          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <Icon 
              icon="solar:magnifer-bold" 
              width={18} 
              height={18} 
              style={{ 
                position: 'absolute', 
                left: 'var(--spacing-2)', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                zIndex: 1
              }} 
            />
            <input 
              type="text"
              placeholder="Search goals..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              style={{
                width: '100%',
                padding: 'var(--spacing-2) var(--spacing-2) var(--spacing-2) calc(var(--spacing-2) + 24px)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                background: 'var(--surface)',
                fontSize: 'var(--font-base)'
              }}
            />
          </div>

          <button
            onClick={() => setFilters({ context: '', status: '', priority: '', search: '' })}
            style={{
              background: 'var(--surface)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
              padding: 'var(--spacing-2) var(--spacing-3)',
              borderRadius: 'var(--radius)',
              fontSize: 'var(--font-base)',
              cursor: 'pointer'
            }}
          >
            <Icon icon="solar:filter-bold" width={16} height={16} style={{ marginRight: 'var(--spacing-1)' }} />
            Clear Filters
          </button>
        </div>
      </header>

      {/* Goals Display */}
      {loading ? (
        <LoadingState />
      ) : filteredGoals.length === 0 ? (
        <EmptyState 
          title="No goals found"
          message="Try adjusting your filters or create a new goal"
          action={{
            label: 'Create New Goal',
            onClick: () => setShowCreateModal(true)
          }}
        />
      ) : viewMode === 'cards' ? (
        <div className="goal-cards-desktop">
          {filteredGoals.map(goal => (
            <GoalCard
              key={goal._id}
              goal={goal}
              onUpdate={handleUpdateGoal}
              onDelete={handleDeleteGoal}
            />
          ))}
        </div>
      ) : (
        <GoalTable
          goals={filteredGoals}
          onUpdate={handleUpdateGoal}
          onDelete={handleDeleteGoal}
          selectedGoals={selectedGoals}
          onSelectionChange={setSelectedGoals}
        />
      )}

      {error && (
        <div className="flex-center" style={{ 
          background: 'var(--bg)',
          color: 'var(--text)',
          padding: 'var(--spacing-4)',
          borderRadius: 'var(--radius)',
          marginTop: 'var(--spacing-4)'
        }}>
          Error: {error}
        </div>
      )}

      {/* Create Goal Modal */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 'var(--z-modal)'
        }}>
          <div style={{
            background: 'var(--surface)',
            borderRadius: 'var(--radius)',
            padding: 'var(--spacing-5)',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h2 style={{ fontSize: 'var(--font-xl)', margin: '0 0 var(--spacing-4) 0' }}>
              Create New Goal
            </h2>
            
            <GoalForm
              onSubmit={handleCreateGoal}
              onCancel={() => setShowCreateModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Simple GoalForm component for the modal
function GoalForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    context: 'personal',
    priority: 'medium',
    dueDate: '',
    tags: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const goalData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };
    onSubmit(goalData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
      <div>
        <label style={{ display: 'block', marginBottom: 'var(--spacing-1)', fontSize: 'var(--font-sm)', color: 'var(--text)' }}>
          Title *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          style={{
            width: '100%',
            padding: 'var(--spacing-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            fontSize: 'var(--font-base)'
          }}
        />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: 'var(--spacing-1)', fontSize: 'var(--font-sm)', color: 'var(--text)' }}>
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          style={{
            width: '100%',
            padding: 'var(--spacing-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            fontSize: 'var(--font-base)',
            resize: 'vertical'
          }}
        />
      </div>

      <div className="grid grid-cols-2" style={{ gap: 'var(--spacing-3)' }}>
        <div>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-1)', fontSize: 'var(--font-sm)', color: 'var(--text)' }}>
            Context
          </label>
          <select
            name="context"
            value={formData.context}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: 'var(--spacing-2)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              fontSize: 'var(--font-base)'
            }}
          >
            <option key="work" value="work">Work</option>
            <option key="health" value="health">Health</option>
            <option key="finance" value="finance">Finance</option>
            <option key="education" value="education">Education</option>
            <option key="personal" value="personal">Personal</option>
            <option key="relationships" value="relationships">Relationships</option>
            <option key="creativity" value="creativity">Creativity</option>
            <option key="travel" value="travel">Travel</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-1)', fontSize: 'var(--font-sm)', color: 'var(--text)' }}>
            Priority
          </label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: 'var(--spacing-2)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              fontSize: 'var(--font-base)'
            }}
          >
            <option key="low" value="low">Low</option>
            <option key="medium" value="medium">Medium</option>
            <option key="high" value="high">High</option>
            <option key="critical" value="critical">Critical</option>
          </select>
        </div>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: 'var(--spacing-1)', fontSize: 'var(--font-sm)', color: 'var(--text)' }}>
          Due Date
        </label>
        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: 'var(--spacing-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            fontSize: 'var(--font-base)'
          }}
        />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: 'var(--spacing-1)', fontSize: 'var(--font-sm)', color: 'var(--text)' }}>
          Tags (comma separated)
        </label>
        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="e.g. urgent, project, learning"
          style={{
            width: '100%',
            padding: 'var(--spacing-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            fontSize: 'var(--font-base)'
          }}
        />
      </div>

      <div className="flex" style={{ gap: 'var(--spacing-2)', marginTop: 'var(--spacing-3)' }}>
        <button
          type="submit"
          style={{
            background: 'var(--work)',
            color: 'white',
            border: 'none',
            padding: 'var(--spacing-2) var(--spacing-3)',
            borderRadius: 'var(--radius)',
            fontSize: 'var(--font-base)',
            cursor: 'pointer'
          }}
        >
          Create Goal
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{
            background: 'var(--surface)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            padding: 'var(--spacing-2) var(--spacing-3)',
            borderRadius: 'var(--radius)',
            fontSize: 'var(--font-base)',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
