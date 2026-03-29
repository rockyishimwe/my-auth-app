import { useState, useEffect } from 'react';
import { useGoals, useUI } from '../contexts/GoalsContext';
import { goalsService } from '../services/api';
import GoalCard from '../components/GoalCard';
import GoalTable from '../components/GoalTable';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import '../styles/variables.css';

export default function DashboardPage() {
  const { goals, fetchGoals, createGoal, updateGoal, deleteGoal, stats, filters, setFilters, loading, error } = useGoals();
  const { addToast } = useUI();

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleCreateGoal = async (goalData) => {
    try {
      await createGoal(goalData);
      addToast('success', 'Goal created successfully');
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

  return (
    <div className="container">
      <header className="flex-between" style={{ marginBottom: 'var(--spacing-5)' }}>
        <h1 style={{ fontSize: 'var(--font-3xl)', fontWeight: 'bold', margin: 0 }}>
          Dashboard
        </h1>
        
        <button 
          className="desktop-only"
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
          onClick={() => handleCreateGoal({ title: 'New Goal', context: 'personal', priority: 'medium' })}
        >
          + New Goal
        </button>
      </header>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-4" style={{ marginBottom: 'var(--spacing-5)' }}>
          <div className="flex-col" style={{ 
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: 'var(--spacing-4)',
            boxShadow: 'var(--shadow)'
          }}>
            <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 'bold', color: 'var(--text)' }}>
              {stats.totalGoals}
            </div>
            <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>
              Total Goals
            </div>
          </div>

          <div className="flex-col" style={{ 
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: 'var(--spacing-4)',
            boxShadow: 'var(--shadow)'
          }}>
            <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 'bold', color: 'var(--text)' }}>
              {stats.activeGoals}
            </div>
            <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>
              Active
            </div>
          </div>

          <div className="flex-col" style={{ 
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: 'var(--spacing-4)',
            boxShadow: 'var(--shadow)'
          }}>
            <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 'bold', color: 'var(--text)' }}>
              {stats.completedGoals}
            </div>
            <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>
              Completed
            </div>
          </div>

          <div className="flex-col" style={{ 
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: 'var(--spacing-4)',
            boxShadow: 'var(--shadow)'
          }}>
            <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 'bold', color: 'var(--text)' }}>
              {Math.round(stats.completionRate)}%
            </div>
            <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>
              Completion Rate
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex" style={{ marginBottom: 'var(--spacing-4)', gap: 'var(--spacing-3)' }}>
        <select 
          value={filters.context}
          onChange={(e) => handleFilterChange('context', e.target.value)}
          style={{
            padding: 'var(--spacing-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            background: 'var(--surface)'
          }}
        >
          <option value="">All Contexts</option>
          <option value="work">Work</option>
          <option value="health">Health</option>
          <option value="finance">Finance</option>
          <option value="education">Education</option>
          <option value="personal">Personal</option>
          <option value="relationships">Relationships</option>
          <option value="creativity">Creativity</option>
          <option value="travel">Travel</option>
        </select>

        <select 
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          style={{
            padding: 'var(--spacing-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            background: 'var(--surface)'
          }}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="archived">Archived</option>
        </select>

        <select 
          value={filters.priority}
          onChange={(e) => handleFilterChange('priority', e.target.value)}
          style={{
            padding: 'var(--spacing-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            background: 'var(--surface)'
          }}
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>

        <input 
          type="text"
          placeholder="Search goals..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          style={{
            flex: 1,
            padding: 'var(--spacing-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            background: 'var(--surface)'
          }}
        />
      </div>

      {/* Goals List */}
      {loading ? (
        <LoadingState />
      ) : filteredGoals.length === 0 ? (
        <EmptyState 
          title="No goals found"
          message="Try adjusting your filters or create a new goal"
        />
      ) : (
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
    </div>
  );
}
