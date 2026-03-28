import { useState } from 'react';
import { useGoals } from '../contexts/GoalsContext';
import '../styles/variables.css';

export default function NotesSection({ goalId, notes = [] }) {
  const { updateGoal } = useGoals();
  const [newNote, setNewNote] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      const updatedNotes = [
        ...notes,
        {
          text: newNote.trim(),
          createdAt: new Date().toISOString()
        }
      ];

      await updateGoal(goalId, { notes: updatedNotes });
      setNewNote('');
      setIsAdding(false);
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const handleDeleteNote = async (noteIndex) => {
    try {
      const updatedNotes = notes.filter((_, index) => index !== noteIndex);
      await updateGoal(goalId, { notes: updatedNotes });
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

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
          Notes
        </h3>
        <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>
          {notes.length} note{notes.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Notes list */}
      <div style={{ marginBottom: 'var(--spacing-3)' }}>
        {notes.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: 'var(--spacing-4)', 
            color: 'var(--text-muted)',
            fontSize: 'var(--font-sm)'
          }}>
            No notes yet. Add your first note!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
            {notes.map((note, index) => (
              <div 
                key={index}
                style={{
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  padding: 'var(--spacing-3)',
                  position: 'relative'
                }}
              >
                <div style={{ 
                  fontSize: 'var(--font-base)', 
                  color: 'var(--text)',
                  lineHeight: '1.4',
                  marginBottom: 'var(--spacing-2)'
                }}>
                  {note.text}
                </div>
                
                <div className="flex-between" style={{ alignItems: 'center' }}>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
                    {formatDate(note.createdAt)}
                  </div>
                  
                  <button
                    onClick={() => handleDeleteNote(index)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      fontSize: 'var(--font-sm)',
                      padding: 'var(--spacing-1)',
                      borderRadius: 'var(--radius)',
                      transition: 'var(--transition-fast)'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = 'var(--border)';
                      e.target.style.color = 'var(--text)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = 'none';
                      e.target.style.color = 'var(--text-muted)';
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add new note */}
      {isAdding ? (
        <form onSubmit={handleAddNote}>
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Enter your note..."
            rows={3}
            style={{
              width: '100%',
              padding: 'var(--spacing-2)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              fontSize: 'var(--font-base)',
              fontFamily: 'inherit',
              resize: 'vertical',
              marginBottom: 'var(--spacing-2)'
            }}
            autoFocus
          />
          <div className="flex" style={{ gap: 'var(--spacing-2)' }}>
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
              Add Note
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setNewNote('');
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
          </div>
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
          + Add Note
        </button>
      )}
    </div>
  );
}
