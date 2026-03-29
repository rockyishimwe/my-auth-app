import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useAuth } from '../contexts/AuthContext';
import { useUI } from '../contexts/GoalsContext';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { sidebarCollapsed, toggleSidebar, activePage } = useUI();
  const navigate = useNavigate();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavigation = (page) => {
    navigate(page);
  };

  const contextItems = [
    { id: 'work', label: 'Work', color: 'var(--work)', icon: 'solar:bag-bold' },
    { id: 'health', label: 'Health', color: 'var(--health)', icon: 'solar:heart-pulse-bold' },
    { id: 'finance', label: 'Finance', color: 'var(--finance)', icon: 'solar:wallet-bold' },
    { id: 'education', label: 'Education', color: 'var(--education)', icon: 'solar:book-bold' },
    { id: 'personal', label: 'Personal', color: 'var(--personal)', icon: 'solar:user-bold' },
    { id: 'relationships', label: 'Relationships', color: 'var(--relationships)', icon: 'solar:users-group-bold' },
    { id: 'creativity', label: 'Creativity', color: 'var(--creativity)', icon: 'solar:pallete-bold' },
    { id: 'travel', label: 'Travel', color: 'var(--travel)', icon: 'solar:map-bold' }
  ];

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'solar:widget-bold' },
    { id: 'goals', label: 'Goals', icon: 'solar:target-bold' },
    { id: 'analytics', label: 'Analytics', icon: 'solar:chart-bold' },
    { id: 'contexts', label: 'Contexts', icon: 'solar:filter-bold' },
    { id: 'settings', label: 'Settings', icon: 'solar:settings-bold' }
  ];

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth <= 1024;

  if (isMobile) {
    return (
      <div 
        className={`sidebar-mobile ${sidebarCollapsed ? '' : 'active'}`}
        style={{
          background: 'var(--bg-primary)',
          color: 'white',
          height: '100vh',
          overflowY: 'auto',
          zIndex: 'var(--z-sidebar)',
          transition: 'transform var(--transition-normal)'
        }}
      >
        <div style={{ padding: 'var(--spacing-4)' }}>
          {/* Mobile Header */}
          <div className="flex-between" style={{ marginBottom: 'var(--spacing-5)' }}>
            <h2 style={{ fontSize: 'var(--font-xl)', margin: 0 }}>GoalOS</h2>
            <button 
              onClick={toggleSidebar}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: 'var(--font-lg)',
                cursor: 'pointer'
              }}
            >
              <Icon icon="solar:close-circle-bold" width={24} height={24} style={{ color: 'white' }} />
            </button>
          </div>

          {/* User Card */}
          {user && (
            <div 
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 'var(--radius)',
                padding: 'var(--spacing-3)',
                marginBottom: 'var(--spacing-5)'
              }}
            >
              <div className="flex-center" style={{ marginBottom: 'var(--spacing-2)' }}>
                <div 
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: user.avatarColor || 'var(--work)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'var(--font-lg)',
                    fontWeight: 'bold',
                    color: 'white'
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--font-base)', fontWeight: 'bold' }}>{user.name}</div>
                <div style={{ fontSize: 'var(--font-sm)', opacity: 0.8 }}>{user.email}</div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={{ marginBottom: 'var(--spacing-5)' }}>
            <h3 style={{ fontSize: 'var(--font-sm)', opacity: 0.8, marginBottom: 'var(--spacing-3)' }}>NAVIGATION</h3>
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => { handleNavigation(`/${item.id}`); toggleSidebar(); }}
                style={{
                  width: '100%',
                  border: 'none',
                  color: 'white',
                  padding: 'var(--spacing-2)',
                  borderRadius: 'var(--radius)',
                  fontSize: 'var(--font-base)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-2)',
                  opacity: activePage === item.id ? 1 : 0.8,
                  background: activePage === item.id ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
                }}
              >
                <Icon icon={item.icon} width={22} height={22} style={{ color: 'white' }} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Context Quick Links */}
          <div>
            <h3 style={{ fontSize: 'var(--font-sm)', opacity: 0.8, marginBottom: 'var(--spacing-3)' }}>CONTEXTS</h3>
            {contextItems.map(context => (
              <button
                key={context.id}
                onClick={() => { handleNavigation(`/goals?context=${context.id}`); toggleSidebar(); }}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  padding: 'var(--spacing-2)',
                  borderRadius: 'var(--radius)',
                  fontSize: 'var(--font-base)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-2)',
                  opacity: 0.8
                }}
              >
                <Icon icon={context.icon} width={22} height={22} style={{ color: context.color }} />
                <span>{context.label}</span>
              </button>
            ))}
          </div>

          {/* Logout */}
          <div style={{ marginTop: 'var(--spacing-5)' }}>
            <button
              onClick={() => { logout(); toggleSidebar(); }}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                padding: 'var(--spacing-2)',
                borderRadius: 'var(--radius)',
                fontSize: 'var(--font-base)',
                cursor: 'pointer'
              }}
            >
              <Icon icon="solar:logout-bold" width={18} height={18} style={{ color: 'white', marginRight: 'var(--spacing-2)' }} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={isTablet ? 'sidebar-tablet' : 'sidebar-desktop'}
      style={{
        background: 'var(--bg-primary)',
        color: 'white',
        height: '100vh',
        overflowY: 'auto',
        zIndex: 'var(--z-sidebar)',
        transition: 'width var(--transition-normal)',
        ...(isTablet && sidebarCollapsed && { width: '48px' })
      }}
    >
      {/* Logo */}
      <div style={{ padding: 'var(--spacing-4)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: 'var(--spacing-4)' }}>
        <div className="flex-center" style={{ gap: 'var(--spacing-2)' }}>
          <div 
            style={{
              width: '32px',
              height: '32px',
              background: 'var(--work)',
              borderRadius: 'var(--radius)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'var(--font-lg)',
              fontWeight: 'bold'
            }}
          >
            G
          </div>
          <span style={{ fontSize: 'var(--font-xl)', fontWeight: 'bold' }}>GoalOS</span>
        </div>
      </div>

      {/* User Card */}
      {user && (
        <div 
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 'var(--radius)',
            padding: 'var(--spacing-3)',
            marginBottom: 'var(--spacing-5)'
          }}
        >
          <div className="flex-center" style={{ marginBottom: 'var(--spacing-2)' }}>
            <div 
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: user.avatarColor || 'var(--work)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'var(--font-lg)',
                fontWeight: 'bold',
                color: 'white'
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--font-base)', fontWeight: 'bold' }}>{user.name}</div>
            <div style={{ fontSize: 'var(--font-sm)', opacity: 0.8 }}>{user.email}</div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div style={{ marginBottom: 'var(--spacing-5)' }}>
        <h3 style={{ fontSize: 'var(--font-sm)', opacity: 0.8, marginBottom: 'var(--spacing-3)' }}>NAVIGATION</h3>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => handleNavigation(`/${item.id}`)}
            style={{
              width: '100%',
              border: 'none',
              color: 'white',
              padding: 'var(--spacing-2)',
              borderRadius: 'var(--radius)',
              fontSize: 'var(--font-base)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-2)',
              opacity: activePage === item.id ? 1 : 0.8,
              background: activePage === item.id ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
            }}
          >
            <Icon icon={item.icon} width={22} height={22} style={{ color: 'white' }} />
            {!sidebarCollapsed && <span>{item.label}</span>}
          </button>
        ))}
      </div>

      {/* Context Quick Links */}
      <div>
        <h3 style={{ fontSize: 'var(--font-sm)', opacity: 0.8, marginBottom: 'var(--spacing-3)' }}>CONTEXTS</h3>
        {contextItems.map(context => (
          <button
            key={context.id}
            onClick={() => handleNavigation(`/goals?context=${context.id}`)}
            style={{
              width: '100%',
              background: 'none',
              border: 'none',
              color: 'white',
              padding: 'var(--spacing-2)',
              borderRadius: 'var(--radius)',
              fontSize: 'var(--font-base)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-2)',
              opacity: 0.8
            }}
          >
            <Icon icon={context.icon} width={22} height={22} style={{ color: context.color }} />
            {!sidebarCollapsed && <span>{context.label}</span>}
          </button>
        ))}
      </div>

      {/* Collapse Toggle */}
      <div style={{ position: 'absolute', bottom: 'var(--spacing-4)', left: 0, right: 0, textAlign: 'center' }}>
        <button
          onClick={toggleSidebar}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
            padding: 'var(--spacing-2)',
            borderRadius: 'var(--radius)',
            fontSize: 'var(--font-base)',
            cursor: 'pointer',
            width: isTablet ? '100%' : 'auto'
          }}
        >
          <Icon 
            icon={sidebarCollapsed ? "solar:hamburger-menu-bold" : "solar:close-circle-bold"} 
            width={18} 
            height={18} 
            style={{ color: 'white' }} 
          />
        </button>
      </div>
    </div>
  );
}
