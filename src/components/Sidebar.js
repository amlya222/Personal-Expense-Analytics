import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Sidebar.css';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || '';

function Sidebar({ isOpen, onToggle }) {
  const location = useLocation();

  const [user, setUser] = useState({ fullName: 'Amit Kumar', email: 'amit@example.com' });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await axios.get(`${apiBaseUrl}/api/settings`);
        if (mounted && res && res.data) {
          setUser({ fullName: res.data.fullName || user.fullName, email: res.data.email || user.email });
        }
      } catch (e) {
        // ignore - keep defaults
      }
    };
    load();
    const onUpdate = (e) => {
      const d = e?.detail || {};
      setUser((prev) => ({
        fullName: d.fullName || prev.fullName,
        email: d.email || prev.email,
      }));
    };
    window.addEventListener('settings:updated', onUpdate);
    return () => {
      mounted = false;
      window.removeEventListener('settings:updated', onUpdate);
    };
  }, []);

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
            <div className="avatar">{(user.fullName || 'A').split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase()}</div>
            <div className="user-info">
              <p className="user-name">{user.fullName}</p>
              <p className="user-email">{user.email}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
