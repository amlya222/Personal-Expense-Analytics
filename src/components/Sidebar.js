import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ isOpen, onToggle }) {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/transactions', label: 'Transactions', icon: '💳' },
    { path: '/analytics', label: 'Analytics', icon: '📈' },
    { path: '/budgets', label: 'Budgets', icon: '💰' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <button className="toggle-btn" onClick={onToggle} title="Toggle Sidebar">
          {isOpen ? '←' : '→'}
        </button>
        {isOpen && (
          <div className="logo">
            <span className="logo-icon">💜</span>
            <span className="logo-text">Expense<br/>Insight</span>
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            title={!isOpen ? item.label : ''}
          >
            <span className="nav-icon">{item.icon}</span>
            {isOpen && <span className="nav-label">{item.label}</span>}
          </Link>
        ))}
      </nav>

      {isOpen && (
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">AK</div>
            <div className="user-info">
              <p className="user-name">Amit Kumar</p>
              <p className="user-email">amit@example.com</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
