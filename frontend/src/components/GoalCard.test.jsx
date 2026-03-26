import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { GoalsProvider } from '../contexts/GoalsContext';
import { UIProvider } from '../contexts/UIContext';
import GoalCard from '../components/GoalCard';

// Mock the UI context
jest.mock('../contexts/UIContext', () => ({
  ...jest.requireActual('../contexts/UIContext'),
  useUI: () => ({
    openModal: jest.fn()
  })
}));

describe('GoalCard Component', () => {
  const mockGoal = {
    _id: '1',
    title: 'Learn React',
    description: 'Complete React tutorial and build projects',
    context: 'education',
    priority: 'medium',
    status: 'active',
    progress: 75,
    dueDate: '2024-12-31',
    tags: ['react', 'frontend', 'javascript'],
    milestones: [
      { text: 'Complete basics', completed: true },
      { text: 'Build first project', completed: false }
    ],
    notes: [{ text: 'Started tutorial', createdAt: '2024-01-01' }],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  };

  const renderWithProviders = (component) => {
    return render(
      <GoalsProvider>
        <UIProvider>
          {component}
        </UIProvider>
      </GoalsProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render goal card with all information', () => {
    renderWithProviders(<GoalCard goal={mockGoal} onUpdate={jest.fn()} onDelete={jest.fn()} />);
    
    expect(screen.getByText('Learn React')).toBeInTheDocument();
    expect(screen.getByText('Complete React tutorial and build projects')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('education')).toBeInTheDocument();
    expect(screen.getByText('medium')).toBeInTheDocument();
    expect(screen.getByText('1/2 milestones')).toBeInTheDocument();
    expect(screen.getByText('1 notes')).toBeInTheDocument();
  });

  it('should display context badge with correct color', () => {
    renderWithProviders(<GoalCard goal={mockGoal} onUpdate={jest.fn()} onDelete={jest.fn()} />);
    
    const contextBadge = screen.getByText('education');
    expect(contextBadge).toHaveStyle({
      background: 'var(--education)'
    });
  });

  it('should display priority badge with correct color', () => {
    renderWithProviders(<GoalCard goal={mockGoal} onUpdate={jest.fn()} onDelete={jest.fn()} />);
    
    const priorityBadge = screen.getByText('medium');
    expect(priorityBadge).toHaveStyle({
      background: 'var(--priority-medium)'
    });
  });

  it('should display progress bar with correct width', () => {
    renderWithProviders(<GoalCard goal={mockGoal} onUpdate={jest.fn()} onDelete={jest.fn()} />);
    
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveStyle({
      width: '75%'
    });
  });

  it('should display due date with correct format', () => {
    renderWithProviders(<GoalCard goal={mockGoal} onUpdate={jest.fn()} onDelete={jest.fn()} />);
    
    expect(screen.getByText('12/31/2024')).toBeInTheDocument();
  });

  it('should display tags correctly', () => {
    renderWithProviders(<GoalCard goal={mockGoal} onUpdate={jest.fn()} onDelete={jest.fn()} />);
    
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('frontend')).toBeInTheDocument();
    expect(screen.getByText('javascript')).toBeInTheDocument();
  });

  it('should handle overdue goals correctly', () => {
    const overdueGoal = {
      ...mockGoal,
      dueDate: '2024-01-01'
    };
    
    renderWithProviders(<GoalCard goal={overdueGoal} onUpdate={jest.fn()} onDelete={jest.fn()} />);
    
    expect(screen.getByText('Overdue')).toBeInTheDocument();
  });

  it('should handle goals without description', () => {
    const goalWithoutDescription = {
      ...mockGoal,
      description: null
    };
    
    renderWithProviders(<GoalCard goal={goalWithoutDescription} onUpdate={jest.fn()} onDelete={jest.fn()} />);
    
    expect(screen.queryByText('Complete React tutorial and build projects')).not.toBeInTheDocument();
  });

  it('should handle goals without due date', () => {
    const goalWithoutDueDate = {
      ...mockGoal,
      dueDate: null
    };
    
    renderWithProviders(<GoalCard goal={goalWithoutDueDate} onUpdate={jest.fn()} onDelete={jest.fn()} />);
    
    expect(screen.queryByText(/due:/i)).not.toBeInTheDocument();
  });

  it('should handle goals without tags', () => {
    const goalWithoutTags = {
      ...mockGoal,
      tags: []
    };
    
    renderWithProviders(<GoalCard goal={goalWithoutTags} onUpdate={jest.fn()} onDelete={jest.fn()} />);
    
    expect(screen.queryByText('Tags:')).not.toBeInTheDocument();
  });

  it('should handle goals without milestones', () => {
    const goalWithoutMilestones = {
      ...mockGoal,
      milestones: []
    };
    
    renderWithProviders(<GoalCard goal={goalWithoutMilestones} onUpdate={jest.fn()} onDelete={jest.fn()} />);
    
    expect(screen.queryByText(/milestones/i)).not.toBeInTheDocument();
  });

  it('should handle goals without notes', () => {
    const goalWithoutNotes = {
      ...mockGoal,
      notes: []
    };
    
    renderWithProviders(<GoalCard goal={goalWithoutNotes} onUpdate={jest.fn()} onDelete={jest.fn()} />);
    
    expect(screen.queryByText(/notes/i)).not.toBeInTheDocument();
  });

  it('should call openModal when edit button is clicked', () => {
    const { useUI } = require('../contexts/UIContext');
    const mockOpenModal = jest.fn();
    useUI.mockReturnValue({ openModal: mockOpenModal });

    renderWithProviders(<GoalCard goal={mockGoal} onUpdate={jest.fn()} onDelete={jest.fn()} />);
    
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    expect(mockOpenModal).toHaveBeenCalledWith('editGoal', { goal: mockGoal });
  });

  it('should call openModal when delete button is clicked', () => {
    const { useUI } = require('../contexts/UIContext');
    const mockOpenModal = jest.fn();
    useUI.mockReturnValue({ openModal: mockOpenModal });

    renderWithProviders(<GoalCard goal={mockGoal} onUpdate={jest.fn()} onDelete={jest.fn()} />);
    
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    expect(mockOpenModal).toHaveBeenCalledWith('confirmDelete', { 
      goalId: mockGoal._id, 
      goalTitle: mockGoal.title 
    });
  });

  it('should call openModal when card is clicked', () => {
    const { useUI } = require('../contexts/UIContext');
    const mockOpenModal = jest.fn();
    useUI.mockReturnValue({ openModal: mockOpenModal });

    renderWithProviders(<GoalCard goal={mockGoal} onUpdate={jest.fn()} onDelete={jest.fn()} />);
    
    const card = screen.getByRole('article') || screen.getByText('Learn React').closest('div');
    fireEvent.click(card);

    expect(mockOpenModal).toHaveBeenCalledWith('editGoal', { goal: mockGoal });
  });

  it('should display different status colors correctly', () => {
    const statuses = ['active', 'in-progress', 'completed', 'archived'];
    
    statuses.forEach(status => {
      const goalWithStatus = { ...mockGoal, status };
      const { unmount } = renderWithProviders(
        <GoalCard goal={goalWithStatus} onUpdate={jest.fn()} onDelete={jest.fn()} />
      );
      
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveStyle({
        background: `var(--status-${status})`
      });
      
      unmount();
    });
  });

  it('should display different priority colors correctly', () => {
    const priorities = ['low', 'medium', 'high', 'critical'];
    
    priorities.forEach(priority => {
      const goalWithPriority = { ...mockGoal, priority };
      const { unmount } = renderWithProviders(
        <GoalCard goal={goalWithPriority} onUpdate={jest.fn()} onDelete={jest.fn()} />
      );
      
      const priorityBadge = screen.getByText(priority);
      expect(priorityBadge).toHaveStyle({
        background: `var(--priority-${priority})`
      });
      
      unmount();
    });
  });

  it('should display different context colors correctly', () => {
    const contexts = ['work', 'health', 'finance', 'education', 'personal', 'relationships', 'creativity', 'travel'];
    
    contexts.forEach(context => {
      const goalWithContext = { ...mockGoal, context };
      const { unmount } = renderWithProviders(
        <GoalCard goal={goalWithContext} onUpdate={jest.fn()} onDelete={jest.fn()} />
      );
      
      const contextBadge = screen.getByText(context);
      expect(contextBadge).toHaveStyle({
        background: `var(--${context})`
      });
      
      unmount();
    });
  });
});
