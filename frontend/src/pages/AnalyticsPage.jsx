import { useState, useMemo } from 'react';
import { Icon } from '@iconify/react';
import { useGoals } from '../contexts/GoalsContext';
import '../styles/variables.css';

// ─────────────────────────────────────────────
// SUB-COMPONENTS — defined outside AnalyticsPage so React
// doesn't treat them as new component types on every render,
// which would cause unnecessary unmount/remount cycles.
// ─────────────────────────────────────────────

const BarChart = ({ data, color, height = 200 }) => {
  // FIX: guard against divide-by-zero when all counts are 0
  const maxValue = Math.max(...data.map(d => d.count), 1);
  const barWidth = 100 / data.length;

  return (
    <div style={{ height: `${height}px`, position: 'relative' }}>
      {data.map((item, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: `${index * barWidth}%`,
            bottom: 0,
            width: `${barWidth * 0.8}%`,
            height: `${(item.count / maxValue) * 100}%`,
            background: color,
            borderRadius: '2px',
            transition: 'var(--transition-fast)'
          }}
          title={`${item.count} goals`}
        />
      ))}
    </div>
  );
};

const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  };
};

const createPath = (startAngle, endAngle, radius) => {
  const start = polarToCartesian(0, 0, radius, endAngle);
  const end   = polarToCartesian(0, 0, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return [
    'M', 0, 0,
    'L', start.x, start.y,
    'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    'Z'
  ].join(' ');
};

const DonutChart = ({ data, colors, size = 200 }) => {
  const total = Object.values(data).reduce((sum, val) => sum + val, 0);
  if (total === 0) {
    return <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No data</div>;
  }

  let currentAngle = 0;
  const segments = Object.entries(data).map(([key, value]) => {
    const angle   = (value / total) * 360;
    const segment = { key, value, startAngle: currentAngle, endAngle: currentAngle + angle };
    currentAngle += angle;
    return segment;
  });

  return (
    <div style={{ position: 'relative', width: `${size}px`, height: `${size}px` }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {segments.map((segment) => (
          <path
            key={segment.key}
            d={createPath(segment.startAngle, segment.endAngle, size / 2 - 10)}
            fill={colors[segment.key]}
            stroke="white"
            strokeWidth="2"
            style={{ transform: `translate(${size / 2}px, ${size / 2}px)` }}
          />
        ))}
      </svg>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)' }}>
          <Icon icon="solar:target-bold" width={24} height={24} style={{ color: 'var(--work)' }} />
          <div style={{ fontSize: 'var(--font-lg)', fontWeight: 'bold', color: 'var(--text)' }}>
            {total}
          </div>
        </div>
        <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>
          Total Goals
        </div>
      </div>
    </div>
  );
};

const HeatMap = ({ data }) => {
  // FIX: guard against divide-by-zero when all counts are 0
  const maxCount = Math.max(...data.map(d => d.count), 1);

  const getColor = (count) => {
    if (count === 0) return 'var(--bg)';
    const intensity = count / maxCount;
    return `rgba(59, 130, 246, ${intensity * 0.8 + 0.2})`;
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(52, 1fr)', gap: '2px' }}>
      {data.map((week, index) => (
        <div
          key={index}
          // FIX: title must be an HTML attribute, not inside the style object
          title={`Week ${week.week + 1}: ${week.count} goals`}
          style={{
            width: '12px',
            height: '12px',
            background: getColor(week.count),
            borderRadius: '2px'
          }}
        />
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────

export default function AnalyticsPage() {
  const { goals } = useGoals();
  const [timeRange, setTimeRange] = useState('12months');

  // FIX: memoize so analytics only recalculate when goals or timeRange change
  const analytics = useMemo(() => {
    const monthsAgo = (months) => {
      const date = new Date();
      date.setMonth(date.getMonth() - months);
      return date;
    };

    const filterByTimeRange = (goal) => {
      if (timeRange === 'all') return true;
      const months = timeRange === '3months' ? 3 : timeRange === '6months' ? 6 : 12;
      return new Date(goal.createdAt) >= monthsAgo(months);
    };

    const filteredGoals = goals.filter(filterByTimeRange);

    // Goals created per month
    const numMonths = timeRange === '3months' ? 3 : timeRange === '6months' ? 6 : 12;
    const monthlyData = {};
    for (let i = 0; i < numMonths; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyData[monthKey] = 0;
    }

    filteredGoals.forEach(goal => {
      const date     = new Date(goal.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (Object.prototype.hasOwnProperty.call(monthlyData, monthKey)) {
        monthlyData[monthKey]++;
      }
    });

    const goalsPerMonth = Object.keys(monthlyData)
      .sort()
      .map(month => ({ month, count: monthlyData[month] }));

    // Context distribution
    const contextKeys = ['work', 'health', 'finance', 'education', 'personal', 'relationships', 'creativity', 'travel'];
    const contextDistribution = {};
    contextKeys.forEach(ctx => {
      contextDistribution[ctx] = filteredGoals.filter(g => g.context === ctx).length;
    });

    // Priority distribution
    const priorityDistribution = {
      low:      filteredGoals.filter(g => g.priority === 'low').length,
      medium:   filteredGoals.filter(g => g.priority === 'medium').length,
      high:     filteredGoals.filter(g => g.priority === 'high').length,
      critical: filteredGoals.filter(g => g.priority === 'critical').length
    };

    // Status distribution
    const statusDistribution = {
      active:       filteredGoals.filter(g => g.status === 'active').length,
      'in-progress': filteredGoals.filter(g => g.status === 'in-progress').length,
      completed:    filteredGoals.filter(g => g.status === 'completed').length,
      archived:     filteredGoals.filter(g => g.status === 'archived').length
    };

    // Activity heatmap (last 52 weeks)
    const today = new Date();
    const activityHeatmap = [];
    for (let week = 51; week >= 0; week--) {
      const weekDate = new Date(today);
      weekDate.setDate(weekDate.getDate() - week * 7);
      const weekStart = new Date(weekDate);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const weekGoals = filteredGoals.filter(goal => {
        const goalDate = new Date(goal.createdAt);
        return goalDate >= weekStart && goalDate <= weekEnd;
      });

      activityHeatmap.push({ week: 51 - week, count: weekGoals.length, date: weekDate });
    }

    // Summary stats
    const completedGoals = filteredGoals.filter(g => g.status === 'completed');
    const avgDaysToComplete = completedGoals.length > 0
      ? completedGoals.reduce((sum, goal) => {
          const created   = new Date(goal.createdAt);
          const completed = new Date(goal.completedAt);
          const days      = Math.floor((completed - created) / (1000 * 60 * 60 * 24));
          return sum + (isNaN(days) ? 0 : days);
        }, 0) / completedGoals.length
      : 0;

    const bestContext = Object.entries(contextDistribution)
      .filter(([, count]) => count > 0)
      .sort(([, a], [, b]) => b - a)[0];

    const dayCounts = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    filteredGoals.forEach(goal => { dayCounts[new Date(goal.createdAt).getDay()]++; });
    const dayNames       = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const bestDayEntry   = Object.entries(dayCounts).sort(([, a], [, b]) => b - a)[0];
    const mostProductiveDay = dayNames[Number(bestDayEntry[0])];

    return {
      goalsPerMonth,
      contextDistribution,
      priorityDistribution,
      statusDistribution,
      activityHeatmap,
      summary: {
        avgDaysToComplete:  Math.round(avgDaysToComplete),
        bestContext:        bestContext ? `${bestContext[0]} (${bestContext[1]} goals)` : 'No data',
        mostProductiveDay,
        completionRate:     filteredGoals.length > 0
          ? Math.round((completedGoals.length / filteredGoals.length) * 100)
          : 0
      }
    };
  }, [goals, timeRange]);

  const contextColors = {
    work:          'var(--work)',
    health:        'var(--health)',
    finance:       'var(--finance)',
    education:     'var(--education)',
    personal:      'var(--personal)',
    relationships: 'var(--relationships)',
    creativity:    'var(--creativity)',
    travel:        'var(--travel)'
  };

  const priorityColors = {
    low:      'var(--priority-low)',
    medium:   'var(--priority-medium)',
    high:     'var(--priority-high)',
    critical: 'var(--priority-critical)'
  };

  const statusColors = {
    active:        'var(--status-active)',
    'in-progress': 'var(--status-in-progress)',
    completed:     'var(--status-completed)',
    archived:      'var(--status-archived)'
  };

  return (
    <div className="container">
      <header style={{ marginBottom: 'var(--spacing-5)' }}>
        <div className="flex-between">
          <h1 style={{ fontSize: 'var(--font-3xl)', fontWeight: 'bold', margin: 0 }}>
            Analytics
          </h1>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            style={{
              padding: 'var(--spacing-2)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              background: 'var(--surface)',
              fontSize: 'var(--font-base)'
            }}
          >
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="12months">Last 12 Months</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4" style={{ gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-5)' }}>
        {[
          { label: 'Avg. Days to Complete', value: analytics.summary.avgDaysToComplete || 'N/A', color: 'var(--text)', size: 'var(--font-2xl)', icon: 'solar:calendar-bold' },
          { label: 'Best Context',           value: analytics.summary.bestContext,         color: 'var(--text)', size: 'var(--font-lg)', icon: 'solar:star-bold' },
          { label: 'Most Productive Day',    value: analytics.summary.mostProductiveDay,   color: 'var(--text)', size: 'var(--font-lg)', icon: 'solar:fire-bold' },
          { label: 'Completion Rate',        value: `${analytics.summary.completionRate}%`, color: 'var(--status-completed)', size: 'var(--font-2xl)', icon: 'solar:chart-bold' }
        ].map(({ label, value, color, size, icon }) => (
          <div key={label} style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: 'var(--spacing-4)',
            boxShadow: 'var(--shadow-md)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)' }}>
              <Icon icon={icon} width={20} height={20} style={{ color: color }} />
              <h3 style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)', margin: 0 }}>
                {label}
              </h3>
            </div>
            <div style={{ fontSize: size, fontWeight: 'bold', color }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: 'var(--spacing-5)' }}>
        {/* Goals Per Month */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 'var(--spacing-4)', boxShadow: 'var(--shadow-md)' }}>
          <h3 style={{ fontSize: 'var(--font-lg)', margin: '0 0 var(--spacing-3) 0' }}>Goals Created Per Month</h3>
          <BarChart data={analytics.goalsPerMonth} color="var(--work)" />
          <div className="flex" style={{ gap: 'var(--spacing-2)', marginTop: 'var(--spacing-2)' }}>
            {analytics.goalsPerMonth.slice(-6).map((item, index) => (
              <div key={index} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
                  {new Date(item.month + '-01').toLocaleDateString('en', { month: 'short' })}
                </div>
                <div style={{ fontSize: 'var(--font-sm)', fontWeight: 'bold' }}>{item.count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Context Distribution */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 'var(--spacing-4)', boxShadow: 'var(--shadow-md)' }}>
          <h3 style={{ fontSize: 'var(--font-lg)', margin: '0 0 var(--spacing-3) 0' }}>Context Distribution</h3>
          <div className="flex-center">
            <DonutChart data={analytics.contextDistribution} colors={contextColors} />
          </div>
          <div style={{ marginTop: 'var(--spacing-3)' }}>
            {Object.entries(analytics.contextDistribution).map(([context, count]) => (
              <div key={context} className="flex-between" style={{ marginBottom: 'var(--spacing-1)' }}>
                <div className="flex" style={{ alignItems: 'center', gap: 'var(--spacing-2)' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: contextColors[context] }} />
                  <span style={{ fontSize: 'var(--font-sm)', textTransform: 'capitalize' }}>{context}</span>
                </div>
                <span style={{ fontSize: 'var(--font-sm)', fontWeight: 'bold' }}>{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Distribution */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 'var(--spacing-4)', boxShadow: 'var(--shadow-md)' }}>
          <h3 style={{ fontSize: 'var(--font-lg)', margin: '0 0 var(--spacing-3) 0' }}>Priority Distribution</h3>
          <BarChart
            data={Object.entries(analytics.priorityDistribution).map(([key, value]) => ({ key, count: value }))}
            color="var(--priority-medium)"
            height={150}
          />
          <div style={{ marginTop: 'var(--spacing-2)' }}>
            {Object.entries(analytics.priorityDistribution).map(([priority, count]) => (
              <div key={priority} className="flex-between" style={{ marginBottom: 'var(--spacing-1)' }}>
                <div className="flex" style={{ alignItems: 'center', gap: 'var(--spacing-2)' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: priorityColors[priority] }} />
                  <span style={{ fontSize: 'var(--font-sm)', textTransform: 'capitalize' }}>{priority}</span>
                </div>
                <span style={{ fontSize: 'var(--font-sm)', fontWeight: 'bold' }}>{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status Distribution */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 'var(--spacing-4)', boxShadow: 'var(--shadow-md)' }}>
          <h3 style={{ fontSize: 'var(--font-lg)', margin: '0 0 var(--spacing-3) 0' }}>Status Distribution</h3>
          <BarChart
            data={Object.entries(analytics.statusDistribution).map(([key, value]) => ({ key, count: value }))}
            color="var(--status-completed)"
            height={150}
          />
          <div style={{ marginTop: 'var(--spacing-2)' }}>
            {Object.entries(analytics.statusDistribution).map(([status, count]) => (
              <div key={status} className="flex-between" style={{ marginBottom: 'var(--spacing-1)' }}>
                <div className="flex" style={{ alignItems: 'center', gap: 'var(--spacing-2)' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: statusColors[status] }} />
                  <span style={{ fontSize: 'var(--font-sm)', textTransform: 'capitalize' }}>{status.replace('-', ' ')}</span>
                </div>
                <span style={{ fontSize: 'var(--font-sm)', fontWeight: 'bold' }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Heatmap */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: 'var(--spacing-4)',
        boxShadow: 'var(--shadow-md)',
        marginTop: 'var(--spacing-5)'
      }}>
        <h3 style={{ fontSize: 'var(--font-lg)', margin: '0 0 var(--spacing-3) 0' }}>
          Activity Heatmap (Last 52 Weeks)
        </h3>
        <HeatMap data={analytics.activityHeatmap} />
        <div className="flex-between" style={{ marginTop: 'var(--spacing-2)' }}>
          <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>Less</span>
          <div className="flex" style={{ gap: 'var(--spacing-1)' }}>
            {[0, 1, 2, 3, 4].map(level => (
              <div
                key={level}
                style={{
                  width: '12px',
                  height: '12px',
                  background: level === 0 ? 'var(--bg)' : `rgba(59, 130, 246, ${level * 0.2})`,
                  borderRadius: '2px'
                }}
              />
            ))}
          </div>
          <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>More</span>
        </div>
      </div>
    </div>
  );
}