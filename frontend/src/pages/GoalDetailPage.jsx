import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGoals, useUI } from '../contexts';
import { goalsService } from '../services/api';
import ProgressRing from '../components/ProgressRing';
import MilestoneSection from '../components/MilestoneSection';
import NotesSection from '../components/NotesSection';
import LoadingState from '../components/LoadingState';
import '../styles/variables.css';

export default function GoalDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { goals, updateGoal, deleteGoal } = useGoals();
  const { openModal, closeModal } = useUI();

  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const response = await goalsService.getById(id);
        setGoal(response.data);
        setEditForm({
          title: response.data.title,
          description: response.data.description,
          context: response.data.context,
          priority: response.data.priority,
          dueDate: response.data.dueDate ? new Date(response.data.dueDate).toISOString().split('T')[0] : '',
          tags: response.data.tags.join(', ')
        });
      } catch (error) {
        console.error('Error fetching goal:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGoal();
  }, [id]);

  const handleUpdate = async (field, value) => {
    setEditForm({ ...editForm, [field]: value });
  };

  const handleSave = async () => {
    try {
      const updatedGoal = await updateGoal(id, {
        ...editForm,
        tags: editForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      });
      setGoal(updatedGoal);
      setEditing(false);
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const updatedGoal = await goalsService.updateStatus(id, { status: newStatus });
      setGoal(updatedGoal);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async () => {
    openModal('confirmDelete', { goalId: id, goalTitle: goal.title });
  };

  const confirmDelete = async () => {
    try {
      await deleteGoal(id);
      closeModal();
      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting goal:', error);
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

  if (loading) {
    return <LoadingState />;
  }

  if (!goal) {
    return <div className="flex-center" style={{ height: '50vh' }}>Goal not found</div>;
  }

  return (
    <div className="container">
      {/* Breadcrumb Navigation */}
      <nav className="flex" style={{ marginBottom: 'var(--spacing-4)' }}>
        <button 
          onClick={() => navigate('/dashboard')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text)',
            fontSize: 'var(--font-base)',
            cursor: 'pointer'
          }}
        >
          ← Dashboard
        </button>
        <span style={{ margin: '0 var(--spacing-2)', color: 'var(--text-muted)' }}>/</span>
        <span style={{ color: 'var(--text)', fontWeight: 'bold' }}>{goal.title}</span>
      </nav>

      <div className="grid grid-cols-3" style={{ gap: 'var(--spacing-5)' }}>
        {/* Goal Details */}
        <div className="flex-col" style={{ gridColumn: 'span 2' }}>
          <div className="flex-col" style={{ 
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: 'var(--spacing-5)',
            boxShadow: 'var(--shadow-md)'
          }}>
            <div className="flex-between" style={{ marginBottom: 'var(--spacing-3)' }}>
              <h2 style={{ fontSize: 'var(--font-xl)', margin: 0 }}>Goal Details</h2>
              {!editing && (
                <button 
                  onClick={() => setEditing(true)}
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
                  Edit Goal
                </button>
              )}
            </div>

            {editing ? (
              <div className="flex-col" style={{ gap: 'var(--spacing-3)' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 'var(--spacing-1)', fontSize: 'var(--font-sm)', color: 'var(--text)' }}>
                    Title
                  </label>
                  <input 
                    type="text"
                    value={editForm.title}
                    onChange={(e) => handleUpdate('title', e.target.value)}
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
                    value={editForm.description}
                    onChange={(e) => handleUpdate('description', e.target.value)}
                    rows={4}
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
                      value={editForm.context}
                      onChange={(e) => handleUpdate('context', e.target.value)}
                      style={{
                        width: '100%',
                        padding: 'var(--spacing-2)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        fontSize: 'var(--font-base)'
                      }}
                    >
                      <option value="work">Work</option>
                      <option value="health">Health</option>
                      <option value="finance">Finance</option>
                      <option value="education">Education</option>
                      <option value="personal">Personal</option>
                      <option value="relationships">Relationships</option>
                      <option value="creativity">Creativity</option>
                      <option value="travel">Travel</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: 'var(--spacing-1)', fontSize: 'var(--font-sm)', color: 'var(--text)' }}>
                      Priority
                    </label>
                    <select 
                      value={editForm.priority}
                      onChange={(e) => handleUpdate('priority', e.target.value)}
                      style={{
                        width: '100%',
                        padding: 'var(--spacing-2)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        fontSize: 'var(--font-base)'
                      }}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 'var(--spacing-1)', fontSize: 'var(--font-sm)', color: 'var(--text)' }}>
                      Due Date
                    </label>
                  <input 
                    type="date"
                    value={editForm.dueDate}
                    onChange={(e) => handleUpdate('dueDate', e.target.value)}
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
                      Tags
                    </label>
                  <input 
                    type="text"
                    value={editForm.tags}
                    onChange={(e) => handleUpdate('tags', e.target.value)}
                    placeholder="Enter tags separated by commas"
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
                    onClick={handleSave}
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
                    Save Changes
                  </button>
                  <button 
                    onClick={() => setEditing(false)}
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
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-col" style={{ gap: 'var(--spacing-3)' }}>
                <div className="flex-between" style={{ marginBottom: 'var(--spacing-3)' }}>
                  <h3 style={{ fontSize: 'var(--font-lg)', margin: 0, color: getContextColor(goal.context) }}>
                    {goal.title}
                  </h3>
                  <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>
                    Created: {new Date(goal.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div style={{ marginBottom: 'var(--spacing-2)' }}>
                  <p style={{ color: 'var(--text)', lineHeight: '1.5' }}>
                    {goal.description || 'No description provided'}
                  </p>
                </div>

                <div className="grid grid-cols-2" style={{ gap: 'var(--spacing-3)' }}>
                  <div>
                    <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>Context:</span>
                    <span style={{ color: getContextColor(goal.context), fontWeight: 'bold' }}>
                      {goal.context}
                    </span>
                  </div>
                  <div>
                    <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>Priority:</span>
                    <span style={{ color: getPriorityColor(goal.priority), fontWeight: 'bold' }}>
                      {goal.priority}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2" style={{ gap: 'var(--spacing-3)' }}>
                  <div>
                    <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>Status:</span>
                    <span style={{ color: getStatusColor(goal.status), fontWeight: 'bold' }}>
                      {goal.status}
                    </span>
                  </div>
                  <div>
                    <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>Progress:</span>
                    <span style={{ color: 'var(--text)', fontWeight: 'bold' }}>
                      {goal.progress}%
                    </span>
                  </div>
                </div>

                {goal.dueDate && (
                  <div>
                    <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>Due Date:</span>
                    <span style={{ color: 'var(--text)', fontWeight: 'bold' }}>
                      {new Date(goal.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {goal.tags && goal.tags.length > 0 && (
                  <div>
                    <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>Tags:</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-1)' }}>
                      {goal.tags.map(tag => (
                        <span 
                          key={tag}
                          style={{
                            background: 'var(--bg)',
                            color: 'var(--text)',
                            padding: 'var(--spacing-1) var(--spacing-2)',
                            borderRadius: 'var(--radius)',
                            fontSize: 'var(--font-xs)'
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          </div>

          {/* Progress Ring */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <ProgressRing 
              progress={goal.progress}
              size={200}
              strokeWidth={8}
              color={getStatusColor(goal.status)}
            />
          </div>
        </div>

        {/* Milestones */}
        <div style={{ gridColumn: 'span 1' }}>
          <MilestoneSection 
            goalId={goal._id}
            milestones={goal.milestones || []}
          />
        </div>

        {/* Notes */}
        <div style={{ gridColumn: 'span 1' }}>
          <NotesSection 
            goalId={goal._id}
            notes={goal.notes || []}
          />
        </div>
      </div>

      {/* Status Actions */}
      <div className="flex-col" style={{ gridColumn: 'span 3' }}>
        <div style={{ 
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: 'var(--spacing-4)',
          boxShadow: 'var(--shadow-md)'
        }}>
          <h3 style={{ fontSize: 'var(--font-lg)', margin: '0 0 var(--spacing-3)', color: 'var(--text)' }}>Status Actions</h3>
          <div className="flex" style={{ gap: 'var(--spacing-2)' }}>
            <button 
              onClick={() => handleStatusChange('active')}
              style={{
                background: goal.status === 'active' ? 'var(--status-active)' : 'var(--surface)',
                color: goal.status === 'active' ? 'white' : 'var(--text)',
                border: '1px solid var(--border)',
                padding: 'var(--spacing-2) var(--spacing-3)',
                borderRadius: 'var(--radius)',
                fontSize: 'var(--font-base)',
                cursor: 'pointer',
                transition: 'var(--transition-fast)'
              }}
            >
              Set Active
            </button>
            <button 
              onClick={() => handleStatusChange('in-progress')}
              style={{
                background: goal.status === 'in-progress' ? 'var(--status-in-progress)' : 'var(--surface)',
                color: goal.status === 'in-progress' ? 'white' : 'var(--text)',
                border: '1px solid var(--border)',
                padding: 'var(--spacing-2) var(--spacing-3)',
                borderRadius: 'var(--radius)',
                fontSize: 'var(--font-base)',
                cursor: 'pointer',
                transition: 'var(--transition-fast)'
              }}
            >
              In Progress
            </button>
            <button 
              onClick={() => handleStatusChange('completed')}
              style={{
                background: goal.status === 'completed' ? 'var(--status-completed)' : 'var(--surface)',
                color: goal.status === 'completed' ? 'white' : 'var(--text)',
                border: '1px solid var(--border)',
                padding: 'var(--spacing-2) var(--spacing-3)',
                borderRadius: 'var(--radius)',
                fontSize: 'var(--font-base)',
                cursor: 'pointer',
                transition: 'var(--transition-fast)'
              }}
            >
              Completed
            </button>
            <button 
              onClick={() => handleStatusChange('archived')}
              style={{
                background: goal.status === 'archived' ? 'var(--status-archived)' : 'var(--surface)',
                color: goal.status === 'archived' ? 'white' : 'var(--text)',
                border: '1px solid var(--border)',
                padding: 'var(--spacing-2) var(--spacing-3)',
                borderRadius: 'var(--radius)',
                fontSize: 'var(--font-base)',
                cursor: 'pointer',
                transition: 'var(--transition-fast)'
              }}
            >
              Archived
            </button>
          </div>

          <button 
            onClick={handleDelete}
            style={{
              background: 'var(--bg)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
              padding: 'var(--spacing-2) var(--spacing-3)',
              borderRadius: 'var(--radius)',
              fontSize: 'var(--font-base)',
              cursor: 'pointer',
              transition: 'var(--transition-fast)',
              marginTop: 'var(--spacing-3)'
            }}
          >
            Delete Goal
          </button>
        </div>
      </div>
    </div>
  );
}
