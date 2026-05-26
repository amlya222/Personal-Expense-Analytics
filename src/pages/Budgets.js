import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Budgets.css';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [currencySymbol, setCurrencySymbol] = useState('$');
  const [loadingBudgets, setLoadingBudgets] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [newBudget, setNewBudget] = useState({
    category: '',
    budget: '',
    icon: '💰',
  });

  useEffect(() => {
    const fetchBudgets = async () => {
      setLoadingBudgets(true);
      setError(null);
      try {
        const response = await axios.get(`${apiBaseUrl}/api/budgets`);
        setCurrencySymbol(response.data.currencySymbol || '$');
        setBudgets(response.data.budgets || []);
      } catch (err) {
        console.error('Failed to load budgets', err);
        setError(err.response?.data?.message || 'Unable to load budgets.');
      } finally {
        setLoadingBudgets(false);
      }
    };

    fetchBudgets();
  }, []);

  const handleAddBudget = async (e) => {
    e.preventDefault();
    if (!newBudget.category || !newBudget.budget) {
      alert('Please fill all fields');
      return;
    }

    try {
      const response = await axios.post(`${apiBaseUrl}/api/budgets`, {
        category: newBudget.category,
        budget: parseFloat(newBudget.budget),
        icon: newBudget.icon,
      });

      setCurrencySymbol(response.data.currencySymbol || currencySymbol);
      setBudgets(response.data.budgets || []);
      setNewBudget({ category: '', budget: '', icon: '💰' });
      setShowModal(false);
    } catch (err) {
      console.error('Failed to save budget', err);
      alert(err.response?.data?.message || 'Unable to save budget.');
    }
  };

  const getProgressPercentage = (spent, budget) => {
    if (!budget) {
      return spent > 0 ? 100 : 0;
    }
    return Math.min((spent / budget) * 100, 100);
  };

  const totalBudget = budgets.reduce((acc, b) => acc + (b.budget || 0), 0);
  const totalSpent = budgets.reduce((acc, b) => acc + (b.spent || 0), 0);
  const totalRemaining = totalBudget - totalSpent;

  if (loadingBudgets) {
    return (
      <div className="budgets">
        <div className="page-header">
          <h1>Budget Management</h1>
          <p>Set and track budgets for different expense categories</p>
        </div>
        <div className="loading-state">Loading budgets...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="budgets">
        <div className="page-header">
          <h1>Budget Management</h1>
          <p>Set and track budgets for different expense categories</p>
        </div>
        <div className="error-state">{error}</div>
      </div>
    );
  }

  return (
      <div className="budgets">
      <div className="page-header">
        <h1>Budget Management</h1>
        <p>Set and track budgets for different expense categories</p>
      </div>

      {/* Summary Cards */}
      <div className="budget-summary">
        <div className="budget-summary-card total">
          <p className="summary-label">Total Monthly Budget</p>
          <p className="summary-value">{currencySymbol}{totalBudget.toFixed(2)}</p>
        </div>
        <div className="budget-summary-card spent">
          <p className="summary-label">Total Spent</p>
          <p className="summary-value">{currencySymbol}{totalSpent.toFixed(2)}</p>
        </div>
        <div className="budget-summary-card remaining">
          <p className="summary-label">Total Remaining</p>
          <p className="summary-value">{currencySymbol}{totalRemaining.toFixed(2)}</p>
        </div>
        <div className="budget-summary-card health">
          <p className="summary-label">Budget Health</p>
          <p className="summary-value">{Math.round((totalSpent / totalBudget) * 100)}%</p>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="card">
        <div className="overall-progress">
          <div className="progress-info">
            <h3>Overall Budget Progress</h3>
            <p>{currencySymbol}{totalSpent.toFixed(2)} of {currencySymbol}{totalBudget.toFixed(2)} spent</p>
          </div>
          <div className="overall-progress-bar">
            <div
              className="overall-progress-fill"
              style={{ width: `${getProgressPercentage(totalSpent, totalBudget)}%` }}
            ></div>
          </div>
          <p className="progress-percentage">{totalBudget ? Math.round((totalSpent / totalBudget) * 100) : 0}%</p>
        </div>
      </div>

      {/* Category Budgets */}
      <div className="card">
        <div className="card-header">
          <h2>Category Budgets</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Add Budget
          </button>
        </div>

        <div className="budgets-grid">
          {budgets.map(budget => {
            const percentage = getProgressPercentage(budget.spent, budget.budget);
            const remaining = budget.budget - budget.spent;

            return (
              <div key={budget.id} className={`budget-card ${budget.status}`}>
                <div className="budget-header">
                  <div className="budget-title">
                    <span className="budget-icon">{budget.icon}</span>
                    <h3>{budget.category}</h3>
                  </div>
                  <button className="budget-menu">⋯</button>
                </div>

                <div className="budget-progress">
                  <div className="progress-bar-large">
                    <div
                      className={`progress-fill-large ${budget.status}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="progress-labels">
                    <span>{currencySymbol}{budget.spent.toFixed(2)}</span>
                    <span>{currencySymbol}{budget.budget.toFixed(2)}</span>
                  </div>
                </div>

                <div className="budget-details">
                  <div className="budget-detail">
                    <p className="detail-label">Budget</p>
                    <p className="detail-value">{currencySymbol}{budget.budget.toFixed(2)}</p>
                  </div>
                  <div className="budget-detail">
                    <p className="detail-label">Spent</p>
                    <p className="detail-value">{currencySymbol}{budget.spent.toFixed(2)}</p>
                  </div>
                  <div className="budget-detail">
                    <p className="detail-label">Remaining</p>
                    <p className={`detail-value ${remaining < 0 ? 'over' : ''}`}>
                      {currencySymbol}{Math.abs(remaining).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="budget-status">
                  {budget.status === 'over' && (
                    <span className="status-badge over">Over Budget</span>
                  )}
                  {budget.status === 'on-track' && (
                    <span className="status-badge on-track">On Track</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Budget Recommendations */}
      <div className="card">
        <div className="card-header">
          <h2>💡 Budget Recommendations</h2>
        </div>
        <div className="recommendations">
          <div className="recommendation-item">
            <span className="rec-icon">📌</span>
            <div>
              <h4>Set Transport Budget Alert</h4>
              <p>Your transport spending exceeded the budget. Consider increasing the budget limit or reducing expenses.</p>
            </div>
          </div>
          <div className="recommendation-item">
            <span className="rec-icon">📌</span>
            <div>
              <h4>Optimize Food & Dining</h4>
              <p>You have 10% remaining in your food budget. Plan your meals carefully to avoid overspending.</p>
            </div>
          </div>
          <div className="recommendation-item">
            <span className="rec-icon">📌</span>
            <div>
              <h4>Review Entertainment Spending</h4>
              <p>Great job! You still have 30% of your entertainment budget available.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Budget Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Budget</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddBudget}>
              <div className="form-group">
                <label>Category Name</label>
                <input
                  type="text"
                  placeholder="Enter category name"
                  value={newBudget.category}
                  onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Monthly Budget Amount</label>
                <input
                  type="number"
                  placeholder="Enter budget amount"
                  step="0.01"
                  value={newBudget.budget}
                  onChange={(e) => setNewBudget({ ...newBudget, budget: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category Icon</label>
                <div className="icon-selector">
                  {['🍽️', '🚗', '🎬', '💡', '🛍️', '⚕️', '🏠', '💻', '🎮'].map(icon => (
                    <button
                      key={icon}
                      type="button"
                      className={`icon-btn ${newBudget.icon === icon ? 'selected' : ''}`}
                      onClick={() => setNewBudget({ ...newBudget, icon })}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Budgets;
