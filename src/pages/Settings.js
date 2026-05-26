import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Settings.css';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || '';

const defaultSettings = {
  email: 'amit@example.com',
  fullName: 'Amit Kumar',
  currency: 'USD',
  dateFormat: 'MM/DD/YYYY',
  timezone: 'UTC-5 (Eastern Time)',
  language: 'English',
  theme: 'light',
  notifications: {
    emailAlerts: true,
    pushNotifications: true,
    budgetAlerts: true,
    transactionUpdates: false,
  },
  security: {
    twoFactor: false,
    loginAlerts: true,
  },
};

function Settings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [formData, setFormData] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await axios.get(`${apiBaseUrl}/api/settings`);
        setSettings(response.data);
        setFormData(response.data);
      } catch (err) {
        console.error('Failed to load settings', err);
        setError('Unable to load settings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');

    try {
      const response = await axios.put(`${apiBaseUrl}/api/settings`, formData);
      setSettings(response.data);
      setFormData(response.data);
      setEditMode(false);
      // notify other components that settings changed
      try {
        window.dispatchEvent(new CustomEvent('settings:updated', { detail: response.data }));
      } catch (e) {}
      alert('Settings saved successfully!');
    } catch (err) {
      console.error('Failed to save settings', err);
      setError('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(settings);
    setEditMode(false);
  };

  const toggleNotification = (key) => {
    setFormData({
      ...formData,
      notifications: {
        ...formData.notifications,
        [key]: !formData.notifications[key],
      },
    });
  };

  const toggleSecurity = (key) => {
    setFormData({
      ...formData,
      security: {
        ...formData.security,
        [key]: !formData.security[key],
      },
    });
  };

  if (loading) {
    return (
      <div className="settings">
        <div className="page-header">
          <h1>Settings</h1>
          <p>Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="settings">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage your account preferences and application settings</p>
      </div>

      {/* Profile Section */}
      <div className="card">
        <div className="card-header">
          <h2>Profile Settings</h2>
          {!editMode && (
            <button className="btn btn-primary btn-small" onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
          )}
        </div>

        <div className="profile-section">
          <div className="profile-avatar">
            <div className="avatar-large">AK</div>
            <button className="btn btn-secondary btn-small">Change Avatar</button>
          </div>

          <div className="profile-form">
            {editMode ? (
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Currency</label>
                  <select value={formData.currency} onChange={(e) => setFormData({ ...formData, currency: e.target.value })}>
                    <option>USD - US Dollar</option>
                    <option>EUR - Euro</option>
                    <option>GBP - British Pound</option>
                    <option>INR - Indian Rupee</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Timezone</label>
                  <select value={formData.timezone} onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}>
                    <option>UTC-8 (Pacific Time)</option>
                    <option>UTC-6 (Central Time)</option>
                    <option>UTC-5 (Eastern Time)</option>
                    <option>UTC (GMT)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Date Format</label>
                  <select value={formData.dateFormat} onChange={(e) => setFormData({ ...formData, dateFormat: e.target.value })}>
                    <option>MM/DD/YYYY</option>
                    <option>DD/MM/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Language</label>
                  <select value={formData.language} onChange={(e) => setFormData({ ...formData, language: e.target.value })}>
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="profile-info">
                <div className="info-row">
                  <span className="info-label">Full Name</span>
                  <span className="info-value">{settings.fullName}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Email</span>
                  <span className="info-value">{settings.email}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Currency</span>
                  <span className="info-value">{settings.currency}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Timezone</span>
                  <span className="info-value">{settings.timezone}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Date Format</span>
                  <span className="info-value">{settings.dateFormat}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Language</span>
                  <span className="info-value">{settings.language}</span>
                </div>
              </div>
            )}

            {editMode && (
              <div className="form-actions">
                <button className="btn btn-secondary" onClick={handleCancel}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preferences Section */}
      {error && <div className="error-banner">{error}</div>}
      <div className="card">
        <div className="card-header">
          <h2>Preferences</h2>
        </div>

        <div className="preferences-section">
          <div className="preference-group">
            <h3>Theme</h3>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="theme"
                  value="light"
                  checked={formData.theme === 'light'}
                  onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                />
                <span>Light Theme</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  checked={formData.theme === 'dark'}
                  onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                />
                <span>Dark Theme</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="theme"
                  value="auto"
                  checked={formData.theme === 'auto'}
                  onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                />
                <span>Auto (System Default)</span>
              </label>
            </div>
          </div>
        </div>

        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>

      {/* Notifications Section */}
      <div className="card">
        <div className="card-header">
          <h2>Notification Settings</h2>
        </div>

        <div className="notification-list">
          <div className="notification-item">
            <div className="notification-info">
              <h3>Email Alerts</h3>
              <p>Receive email notifications for important transactions</p>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={formData.notifications.emailAlerts}
                onChange={() => toggleNotification('emailAlerts')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="notification-item">
            <div className="notification-info">
              <h3>Push Notifications</h3>
              <p>Receive push notifications on your device</p>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={formData.notifications.pushNotifications}
                onChange={() => toggleNotification('pushNotifications')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="notification-item">
            <div className="notification-info">
              <h3>Budget Alerts</h3>
              <p>Get notified when you're approaching or exceeding your budget</p>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={formData.notifications.budgetAlerts}
                onChange={() => toggleNotification('budgetAlerts')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="notification-item">
            <div className="notification-info">
              <h3>Transaction Updates</h3>
              <p>Receive notifications for every transaction</p>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={formData.notifications.transactionUpdates}
                onChange={() => toggleNotification('transactionUpdates')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Notification Settings'}
        </button>
      </div>

      {/* Security Section */}
      <div className="card">
        <div className="card-header">
          <h2>Security Settings</h2>
        </div>

        <div className="security-list">
          <div className="security-item">
            <div className="security-info">
              <h3>Two-Factor Authentication</h3>
              <p>Add an extra layer of security to your account</p>
              <button className="btn btn-secondary btn-small">
                {formData.security.twoFactor ? 'Manage 2FA' : 'Enable 2FA'}
              </button>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={formData.security.twoFactor}
                onChange={() => toggleSecurity('twoFactor')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="security-item">
            <div className="security-info">
              <h3>Login Alerts</h3>
              <p>Get notified of new login attempts to your account</p>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={formData.security.loginAlerts}
                onChange={() => toggleSecurity('loginAlerts')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="security-action">
            <button className="btn btn-secondary">Change Password</button>
            <button className="btn btn-secondary">View Login History</button>
            <button className="btn btn-danger">Log Out from All Devices</button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card danger-zone">
        <div className="card-header">
          <h2>Danger Zone</h2>
        </div>
        <p>Irreversible and destructive actions</p>
        <button className="btn btn-danger">Delete Account</button>
      </div>
    </div>
  );
}

export default Settings;
