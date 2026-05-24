import React, { useState } from 'react';
import './Budgets.css';

function Budgets() {
  const [budgets, setBudgets] = useState([
    { id: 1, category: 'Food & Dining', budget: 950, spent: 850, icon: '🍽️', status: 'on-track' },
    { id: 2, category: 'Transport', budget: 400, spent: 420, icon: '🚗', status: 'over' },
    { id: 3, category: 'Entertainment', budget: 500, spent: 350, icon: '🎬', status: 'on-track' },
    { id: 4, category: 'Utilities', budget: 300, spent: 280, icon: '💡', status: 'on-track' },
    { id: 5, category: 'Shopping', budget: 400, spent: 250, icon: '🛍️', status: 'on-track' },
    { id: 6, category: 'Health', budget: 200, spent: 180, icon: '⚕️', status: 'on-track' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newBudget, setNewBudget] = useState({
    category: '',
    budget: '',
    icon: '💰',
  });

  const handleAddBudget = (e) => {
    e.preventDefault();
    if (!newBudget.category || !newBudget.budget) {
      alert('Please fill all fields');
      return;
    }
    const budget = {
      id: Math.max(...budgets.map(b => b.id), 0) + 1,
      ...newBudget,
      budget: parseFloat(newBudget.budget),
      spent: 0,
      status: 'on-track',
    };
    setBudgets([...budgets, budget]);
    setNewBudget({ category: '', budget: '', icon: '💰' });
    setShowModal(false);
  };

  const getProgressPercentage = (spent, budget) => {
    return Math.min((spent / budget) * 100, 100);
  };

  const totalBudget = budgets.reduce((acc, b) => acc + b.budget, 0);
  const totalSpent = budgets.reduce((acc, b) => acc + b.spent, 0);
  const totalRemaining = totalBudget - totalSpent;

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
          <p className="summary-value">${totalBudget.toFixed(2)}</p>
        </div>
        <div className="budget-summary-card spent">
          <p className="summary-label">Total Spent</p>
          <p className="summary-value">${totalSpent.toFixed(2)}</p>
        </div>
        <div className="budget-summary-card remaining">
          <p className="summary-label">Total Remaining</p>
          <p className="summary-value">${totalRemaining.toFixed(2)}</p>
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
            <p>${totalSpent.toFixed(2)} of ${totalBudget.toFixed(2)} spent</p>
          </div>
          <div className="overall-progress-bar">
            <div
              className="overall-progress-fill"
              style={{ width: `${getProgressPercentage(totalSpent, totalBudget)}%` }}
            ></div>
          </div>
          <p className="progress-percentage">{Math.round((totalSpent / totalBudget) * 100)}%</p>
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
                    <span>${budget.spent.toFixed(2)}</span>
                    <span>${budget.budget.toFixed(2)}</span>
                  </div>
                </div>

                <div className="budget-details">
                  <div className="budget-detail">
                    <p className="detail-label">Budget</p>
                    <p className="detail-value">${budget.budget.toFixed(2)}</p>
                  </div>
                  <div className="budget-detail">
                    <p className="detail-label">Spent</p>
                    <p className="detail-value">${budget.spent.toFixed(2)}</p>
                  </div>
                  <div className="budget-detail">
                    <p className="detail-label">Remaining</p>
                    <p className={`detail-value ${remaining < 0 ? 'over' : ''}`}>
                      ${Math.abs(remaining).toFixed(2)}
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
