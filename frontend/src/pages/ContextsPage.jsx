import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useGoals } from '../contexts/GoalsContext';
import { useUI } from '../contexts/UIContext';
import '../styles/variables.css';

const contextConfig = {
  work: { icon: 'solar:bag-bold', color: 'var(--work)', label: 'Work' },
  health: { icon: 'solar:heart-pulse-bold', color: 'var(--health)', label: 'Health' },
  finance: { icon: 'solar:wallet-bold', color: 'var(--finance)', label: 'Finance' },
  education: { icon: 'solar:book-bold', color: 'var(--education)', label: 'Education' },
  personal: { icon: 'solar:user-bold', color: 'var(--personal)', label: 'Personal' },
  relationships: { icon: 'solar:users-group-bold', color: 'var(--relationships)', label: 'Relationships' },
  creativity: { icon: 'solar:pallete-bold', color: 'var(--creativity)', label: 'Creativity' },
  travel: { icon: 'solar:map-bold', color: 'var(--travel)', label: 'Travel' }
};

export default function ContextsPage() {
  const { goals, stats } = useGoals();
  const { setActivePage } = useUI();
  const [contextStats, setContextStats] = useState({});

  useEffect(() => {
    // Calculate stats for each context
    const stats = {};
    
    Object.keys(contextConfig).forEach(context => {
      const contextGoals = goals.filter(goal => goal.context === context);
      const completedGoals = contextGoals.filter(goal => goal.status === 'completed');
      const totalGoals = contextGoals.length;
      const completionRate = totalGoals > 0 ? (completedGoals.length / totalGoals) * 100 : 0;
      const avgProgress = totalGoals > 0 
        ? contextGoals.reduce((sum, goal) => sum + goal.progress, 0) / totalGoals 
        : 0;

      stats[context] = {
        total: totalGoals,
        completed: completedGoals.length,
        completionRate: Math.round(completionRate),
        avgProgress: Math.round(avgProgress),
        active: contextGoals.filter(goal => goal.status === 'active').length,
        inProgress: contextGoals.filter(goal => goal.status === 'in-progress').length
      };
    });

    setContextStats(stats);
  }, [goals]);

  const handleContextClick = (context) => {
    // Navigate to goals list filtered by this context
    setActivePage('goals');
    // This would need to be implemented in the GoalsContext
    // setFilters({ context });
  };

  return (
    <div className="container">
      <header style={{ marginBottom: 'var(--spacing-5)' }}>
        <h1 style={{ fontSize: 'var(--font-3xl)', fontWeight: 'bold', margin: 0 }}>
          Contexts
        </h1>
        <p style={{ fontSize: 'var(--font-base)', color: 'var(--text-muted)', margin: 'var(--spacing-2) 0 0 0' }}>
          View and manage your goals by context
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" style={{ gap: 'var(--spacing-4)' }}>
        {Object.entries(contextConfig).map(([context, config]) => {
          const stats = contextStats[context] || {};
          
          return (
            <div
              key={context}
              onClick={() => handleContextClick(context)}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: 'var(--spacing-4)',
                boxShadow: 'var(--shadow-md)',
                cursor: 'pointer',
                transition: 'var(--transition-fast)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
            >
              {/* Context indicator bar */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: config.color
              }} />

              <div style={{ marginBottom: 'var(--spacing-3)' }}>
                <div className="flex-between" style={{ alignItems: 'center' }}>
                  <div className="flex" style={{ alignItems: 'center', gap: 'var(--spacing-2)' }}>
                    <Icon icon={config.icon} width={32} height={32} style={{ color: config.color }} />
                    <h3 style={{ 
                      fontSize: 'var(--font-lg)', 
                      fontWeight: 'bold', 
                      margin: 0,
                      color: 'var(--text)'
                    }}>
                      {config.label}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div style={{ marginBottom: 'var(--spacing-3)' }}>
                <div className="flex-between" style={{ marginBottom: 'var(--spacing-2)' }}>
                  <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>
                    Total Goals
                  </span>
                  <span style={{ fontSize: 'var(--font-lg)', fontWeight: 'bold', color: 'var(--text)' }}>
                    {stats.total || 0}
                  </span>
                </div>

                <div className="flex-between" style={{ marginBottom: 'var(--spacing-2)' }}>
                  <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>
                    Completed
                  </span>
                  <span style={{ fontSize: 'var(--font-base)', color: 'var(--text)' }}>
                    {stats.completed || 0}
                  </span>
                </div>

                <div className="flex-between" style={{ marginBottom: 'var(--spacing-2)' }}>
                  <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>
                    Active
                  </span>
                  <span style={{ fontSize: 'var(--font-base)', color: 'var(--text)' }}>
                    {stats.active || 0}
                  </span>
                </div>

                <div className="flex-between" style={{ marginBottom: 'var(--spacing-2)' }}>
                  <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>
                    In Progress
                  </span>
                  <span style={{ fontSize: 'var(--font-base)', color: 'var(--text)' }}>
                    {stats.inProgress || 0}
                  </span>
                </div>
              </div>

              {/* Completion rate */}
              <div style={{ marginBottom: 'var(--spacing-3)' }}>
                <div className="flex-between" style={{ marginBottom: 'var(--spacing-1)' }}>
                  <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>
                    Completion Rate
                  </span>
                  <span style={{ fontSize: 'var(--font-sm)', fontWeight: 'bold', color: 'var(--text)' }}>
                    {stats.completionRate || 0}%
                  </span>
                </div>
                <div style={{ 
                  height: '8px', 
                  background: 'var(--border)', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div 
                    style={{
                      width: `${stats.completionRate || 0}%`,
                      height: '100%',
                      background: config.color,
                      borderRadius: '4px',
                      transition: 'var(--transition-normal)'
                    }}
                  />
                </div>
              </div>

              {/* Average progress */}
              <div>
                <div className="flex-between" style={{ marginBottom: 'var(--spacing-1)' }}>
                  <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>
                    Average Progress
                  </span>
                  <span style={{ fontSize: 'var(--font-sm)', fontWeight: 'bold', color: 'var(--text)' }}>
                    {stats.avgProgress || 0}%
                  </span>
                </div>
                <div style={{ 
                  height: '8px', 
                  background: 'var(--border)', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div 
                    style={{
                      width: `${stats.avgProgress || 0}%`,
                      height: '100%',
                      background: config.color,
                      borderRadius: '4px',
                      transition: 'var(--transition-normal)'
                    }}
                  />
                </div>
              </div>

              {/* View goals button */}
              <button
                style={{
                  width: '100%',
                  marginTop: 'var(--spacing-3)',
                  background: 'transparent',
                  color: config.color,
                  border: `1px solid ${config.color}`,
                  padding: 'var(--spacing-2)',
                  borderRadius: 'var(--radius)',
                  fontSize: 'var(--font-sm)',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = config.color;
                  e.target.style.color = 'white';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = config.color;
                }}
              >
                View {config.label} Goals
              </button>
            </div>
          );
        })}
      </div>

      {/* Summary section */}
      <div style={{ marginTop: 'var(--spacing-6)' }}>
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: 'var(--spacing-4)',
          boxShadow: 'var(--shadow-md)'
        }}>
          <h2 style={{ fontSize: 'var(--font-xl)', margin: '0 0 var(--spacing-3) 0' }}>
            Summary
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: 'var(--spacing-4)' }}>
            <div>
              <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)', marginBottom: 'var(--spacing-1)' }}>
                Total Goals
              </div>
              <div style={{ fontSize: 'var(--font-xl)', fontWeight: 'bold', color: 'var(--text)' }}>
                {goals.length}
              </div>
            </div>
            
            <div>
              <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)', marginBottom: 'var(--spacing-1)' }}>
                Completed
              </div>
              <div style={{ fontSize: 'var(--font-xl)', fontWeight: 'bold', color: 'var(--status-completed)' }}>
                {goals.filter(g => g.status === 'completed').length}
              </div>
            </div>
            
            <div>
              <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)', marginBottom: 'var(--spacing-1)' }}>
                Active
              </div>
              <div style={{ fontSize: 'var(--font-xl)', fontWeight: 'bold', color: 'var(--status-active)' }}>
                {goals.filter(g => g.status === 'active').length}
              </div>
            </div>
            
            <div>
              <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)', marginBottom: 'var(--spacing-1)' }}>
                In Progress
              </div>
              <div style={{ fontSize: 'var(--font-xl)', fontWeight: 'bold', color: 'var(--status-in-progress)' }}>
                {goals.filter(g => g.status === 'in-progress').length}
              </div>
            </div>
          </div>

          {/* Most active context */}
          <div style={{ marginTop: 'var(--spacing-4)' }}>
            <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)', marginBottom: 'var(--spacing-1)' }}>
              Most Active Context
            </div>
            <div style={{ fontSize: 'var(--font-lg)', fontWeight: 'bold', color: 'var(--text)' }}>
              {(() => {
                const contextCounts = {};
                goals.forEach(goal => {
                  contextCounts[goal.context] = (contextCounts[goal.context] || 0) + 1;
                });
                const mostActive = Object.entries(contextCounts)
                  .sort(([,a], [,b]) => b - a)[0];
                return mostActive ? `${contextConfig[mostActive[0]]?.icon} ${contextConfig[mostActive[0]]?.label} (${mostActive[1]} goals)` : 'No goals yet';
              })()}
            </div>
          </div>

          {/* Best performing context */}
          <div style={{ marginTop: 'var(--spacing-2)' }}>
            <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)', marginBottom: 'var(--spacing-1)' }}>
              Best Performing Context
            </div>
            <div style={{ fontSize: 'var(--font-lg)', fontWeight: 'bold', color: 'var(--text)' }}>
              {(() => {
                const contextPerformance = {};
                Object.entries(contextStats).forEach(([context, stats]) => {
                  if (stats.total > 0) {
                    contextPerformance[context] = stats.completionRate;
                  }
                });
                const bestPerforming = Object.entries(contextPerformance)
                  .sort(([,a], [,b]) => b - a)[0];
                return bestPerforming ? `${contextConfig[bestPerforming[0]]?.icon} ${contextConfig[bestPerforming[0]]?.label} (${bestPerforming[1]}% completion)` : 'No data yet';
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
