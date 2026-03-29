import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useGoals } from '../contexts/GoalsContext';
import { useUI } from '../contexts/UIContext';
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
      if (!id || id === 'undefined' || id === 'null') {
        navigate('/dashboard');
        return;
      }
      
      try {
        const response = await goalsService.getById(id);
        setGoal(response.data);
        setEditForm({
          title: response.data.title,
          description: response.data.description,
          context: response.data.context,
          priority: response.data.priority,
          dueDate: response.data.dueDate
            ? new Date(response.data.dueDate).toISOString().split('T')[0]
            : '',
          tags: response.data.tags.join(', ')
        });
      } catch (error) {
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchGoal();
  }, [id, navigate]);

  const handleUpdate = (field, value) => {
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

  const handleDelete = () => {
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
      active: 'var(--status-active)',
      'in-progress': 'var(--status-in-progress)',
      completed: 'var(--status-completed)',
      archived: 'var(--status-archived)'
    };
    return colors[status] || 'var(--text)';
  };

  if (loading) return <LoadingState />;

  if (!goal) {
    return (
      <div className="flex-center" style={{ height: '50vh' }}>
        Goal not found
      </div>
    );
  }

  return (
    <div className="container">

      {/* Breadcrumb */}
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

        {/* ── Left column: details + progress ring ── */}
        <div className="flex-col" style={{ gridColumn: 'span 2', gap: 'var(--spacing-4)' }}>

          {/* Details card */}
          <div style={{
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
                    cursor: 'pointer'
                  }}
                >
                  <Icon icon="solar:pen-bold" width={16} height={16} style={{ marginRight: 'var(--spacing-2)' }} />
                  Edit Goal
                </button>
              )}
            </div>

            {editing ? (
              /* ── Edit form ── */
              <div className="flex-col" style={{ gap: 'var(--spacing-3)' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 'var(--spacing-1)', fontSize: 'var(--font-sm)' }}>
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
                  <label style={{ display: 'block', marginBottom: 'var(--spacing-1)', fontSize: 'var(--font-sm)' }}>
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
                    <label style={{ display: 'block', marginBottom: 'var(--spacing-1)', fontSize: 'var(--font-sm)' }}>
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
                      {['work','health','finance','education','personal','relationships','creativity','travel'].map(c => (
                        <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: 'var(--spacing-1)', fontSize: 'var(--font-sm)' }}>
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
                      {['low','medium','high','critical'].map(p => (
                        <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 'var(--spacing-1)', fontSize: 'var(--font-sm)' }}>
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
                  <label style={{ display: 'block', marginBottom: 'var(--spacing-1)', fontSize: 'var(--font-sm)' }}>
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={editForm.tags}
                    onChange={(e) => handleUpdate('tags', e.target.value)}
                    placeholder="e.g. fitness, morning, q1"
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-2)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      fontSize: 'var(--font-base)'
                    }}
                  />
                </div>

                <div className="flex" style={{ gap: 'var(--spacing-2)', marginTop: 'var(--spacing-2)' }}>
                  <button
                    onClick={handleSave}
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
                    <Icon icon="solar:check-circle-bold" width={16} height={16} style={{ marginRight: 'var(--spacing-2)' }} />
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
                      cursor: 'pointer'
                    }}
                  >
                    <Icon icon="solar:close-circle-bold" width={16} height={16} style={{ marginRight: 'var(--spacing-2)' }} />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* ── Read-only view ── */
              <div className="flex-col" style={{ gap: 'var(--spacing-3)' }}>
                <div className="flex-between">
                  <h3 style={{ fontSize: 'var(--font-lg)', margin: 0, color: getContextColor(goal.context) }}>
                    {goal.title}
                  </h3>
                  <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>
                    Created: {new Date(goal.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <p style={{ color: 'var(--text)', lineHeight: '1.5', margin: 0 }}>
                  {goal.description || 'No description provided'}
                </p>

                <div className="grid grid-cols-2" style={{ gap: 'var(--spacing-3)' }}>
                  <div>
                    <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>Context: </span>
                    <span style={{ color: getContextColor(goal.context), fontWeight: 'bold' }}>
                      {goal.context}
                    </span>
                  </div>
                  <div>
                    <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>Priority: </span>
                    <span style={{ color: getPriorityColor(goal.priority), fontWeight: 'bold' }}>
                      {goal.priority}
                    </span>
                  </div>
                  <div>
                    <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>Status: </span>
                    <span style={{ color: getStatusColor(goal.status), fontWeight: 'bold' }}>
                      {goal.status}
                    </span>
                  </div>
                  <div>
                    <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>Progress: </span>
                    <span style={{ fontWeight: 'bold' }}>{goal.progress}%</span>
                  </div>
                </div>

                {goal.dueDate && (
                  <div>
                    <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>Due Date: </span>
                    <span style={{ fontWeight: 'bold' }}>
                      {new Date(goal.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {goal.tags && goal.tags.length > 0 && (
                  <div>
                    <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)', display: 'block', marginBottom: 'var(--spacing-1)' }}>
                      Tags:
                    </span>
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
            )}
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

        {/* ── Right column: milestones + notes ── */}
        <div className="flex-col" style={{ gridColumn: 'span 1', gap: 'var(--spacing-4)' }}>
          <MilestoneSection
            goalId={goal._id}
            milestones={goal.milestones || []}
          />
          <NotesSection
            goalId={goal._id}
            notes={goal.notes || []}
          />
        </div>

        {/* ── Full-width: status actions ── */}
        <div style={{ gridColumn: 'span 3' }}>
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: 'var(--spacing-4)',
            boxShadow: 'var(--shadow-md)'
          }}>
            <h3 style={{ fontSize: 'var(--font-lg)', margin: '0 0 var(--spacing-3)', color: 'var(--text)' }}>
              Status Actions
            </h3>

            <div className="flex" style={{ gap: 'var(--spacing-2)' }}>
              {['active', 'in-progress', 'completed', 'archived'].map(s => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  style={{
                    background: goal.status === s ? getStatusColor(s) : 'var(--surface)',
                    color: goal.status === s ? 'white' : 'var(--text)',
                    border: '1px solid var(--border)',
                    padding: 'var(--spacing-2) var(--spacing-3)',
                    borderRadius: 'var(--radius)',
                    fontSize: 'var(--font-base)',
                    cursor: 'pointer'
                  }}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>

            <button
              onClick={handleDelete}
              style={{
                background: 'var(--bg)',
                color: 'var(--relationships)',
                border: '1px solid var(--relationships)',
                padding: 'var(--spacing-2) var(--spacing-3)',
                borderRadius: 'var(--radius)',
                fontSize: 'var(--font-base)',
                cursor: 'pointer',
                marginTop: 'var(--spacing-3)'
              }}
            >
              <Icon icon="solar:trash-bin-trash-bold" width={16} height={16} style={{ marginRight: 'var(--spacing-2)' }} />
              Delete Goal
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}