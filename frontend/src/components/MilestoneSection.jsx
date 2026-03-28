import { useState } from 'react';
import { useGoals } from '../contexts/GoalsContext';
import '../styles/variables.css';

export default function MilestoneSection({ goalId, milestones = [] }) {
  const { updateGoal } = useGoals();
  const [newMilestone, setNewMilestone] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleToggleMilestone = async (milestoneId) => {
    try {
      // Find the milestone to toggle
      const milestone = milestones.find(m => m._id === milestoneId);
      if (!milestone) return;

      // Toggle completion status
      const updatedMilestones = milestones.map(m => 
        m._id === milestoneId 
          ? { ...m, completed: !m.completed, completedAt: !m.completed ? new Date().toISOString() : null }
          : m
      );

      // Update goal with new milestones
      await updateGoal(goalId, { milestones: updatedMilestones });
    } catch (error) {
      console.error('Error toggling milestone:', error);
    }
  };

  const handleAddMilestone = async (e) => {
    e.preventDefault();
    if (!newMilestone.trim()) return;

    try {
      const updatedMilestones = [
        ...milestones,
        {
          text: newMilestone.trim(),
          completed: false,
          completedAt: null
        }
      ];

      await updateGoal(goalId, { milestones: updatedMilestones });
      setNewMilestone('');
      setIsAdding(false);
    } catch (error) {
      console.error('Error adding milestone:', error);
    }
  };

  const handleDeleteMilestone = async (milestoneId) => {
    try {
      const updatedMilestones = milestones.filter(m => m._id !== milestoneId);
      await updateGoal(goalId, { milestones: updatedMilestones });
    } catch (error) {
      console.error('Error deleting milestone:', error);
    }
  };

  const completedCount = milestones.filter(m => m.completed).length;
  const totalCount = milestones.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: 'var(--spacing-4)',
      boxShadow: 'var(--shadow-md)'
    }}>
      <div className="flex-between" style={{ marginBottom: 'var(--spacing-3)' }}>
        <h3 style={{ fontSize: 'var(--font-lg)', margin: 0, color: 'var(--text)' }}>
          Milestones
        </h3>
        <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>
          {completedCount}/{totalCount} completed
        </div>
      </div>

      {/* Progress bar */}
      {totalCount > 0 && (
        <div style={{ marginBottom: 'var(--spacing-3)' }}>
          <div style={{ 
            height: '8px', 
            background: 'var(--border)', 
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div 
              style={{
                width: `${progress}%`,
                height: '100%',
                background: 'var(--status-completed)',
                borderRadius: '4px',
                transition: 'var(--transition-normal)'
              }}
            />
          </div>
        </div>
      )}

      {/* Milestones list */}
      <div style={{ marginBottom: 'var(--spacing-3)' }}>
        {milestones.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: 'var(--spacing-4)', 
            color: 'var(--text-muted)',
            fontSize: 'var(--font-sm)'
          }}>
            No milestones yet. Add your first milestone!
          </div>
        ) : (
          milestones.map((milestone, index) => (
            <div 
              key={milestone._id || index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-2)',
                padding: 'var(--spacing-2)',
                borderRadius: 'var(--radius)',
                background: milestone.completed ? 'var(--bg)' : 'transparent',
                marginBottom: 'var(--spacing-2)'
              }}
            >
              <button
                onClick={() => handleToggleMilestone(milestone._id)}
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: `2px solid ${milestone.completed ? 'var(--status-completed)' : 'var(--border)'}`,
                  background: milestone.completed ? 'var(--status-completed)' : 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'var(--font-xs)',
                  color: milestone.completed ? 'white' : 'transparent'
                }}
              >
                {milestone.completed && '✓'}
              </button>
              
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 'var(--font-base)',
                  color: milestone.completed ? 'var(--text-muted)' : 'var(--text)',
                  textDecoration: milestone.completed ? 'line-through' : 'none'
                }}>
                  {milestone.text}
                </div>
                {milestone.completedAt && (
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
                    Completed {new Date(milestone.completedAt).toLocaleDateString()}
                  </div>
                )}
              </div>

              <button
                onClick={() => handleDeleteMilestone(milestone._id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: 'var(--font-sm)',
                  padding: 'var(--spacing-1)'
                }}
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add new milestone */}
      {isAdding ? (
        <form onSubmit={handleAddMilestone} style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
          <input
            type="text"
            value={newMilestone}
            onChange={(e) => setNewMilestone(e.target.value)}
            placeholder="Enter milestone..."
            style={{
              flex: 1,
              padding: 'var(--spacing-2)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              fontSize: 'var(--font-base)'
            }}
            autoFocus
          />
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
            Add
          </button>
          <button
            type="button"
            onClick={() => {
              setIsAdding(false);
              setNewMilestone('');
            }}
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
        </form>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          style={{
            background: 'var(--bg)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            padding: 'var(--spacing-2) var(--spacing-3)',
            borderRadius: 'var(--radius)',
            fontSize: 'var(--font-base)',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          + Add Milestone
        </button>
      )}
    </div>
  );
}
