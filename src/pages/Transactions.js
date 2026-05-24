import React, { useState } from 'react';
import './Transactions.css';

function Transactions() {
  const [transactions, setTransactions] = useState([
    { id: 1, date: 'Oct 24, 2023', category: 'Food & Dining', description: 'Coffee Shop', amount: -42.50, method: 'Visa', status: 'completed' },
    { id: 2, date: 'Oct 23, 2023', category: 'Advertising', description: 'Facebook Ad Campaign', amount: -2850.00, method: 'Bank Transfer', status: 'pending' },
    { id: 3, date: 'Oct 22, 2023', category: 'Entertainment', description: 'Movie Tickets', amount: -25.00, method: 'Debit Card', status: 'completed' },
    { id: 4, date: 'Oct 21, 2023', category: 'Salary', description: 'Monthly Salary', amount: 12400.00, method: 'Direct Deposit', status: 'completed' },
    { id: 5, date: 'Oct 20, 2023', category: 'Utilities', description: 'Electricity Bill', amount: -125.50, method: 'Bank Transfer', status: 'completed' },
    { id: 6, date: 'Oct 19, 2023', category: 'Transport', description: 'Uber Ride', amount: -18.75, method: 'Credit Card', status: 'completed' },
    { id: 7, date: 'Oct 18, 2023', category: 'Shopping', description: 'Online Shopping', amount: -156.99, method: 'Visa', status: 'completed' },
    { id: 8, date: 'Oct 17, 2023', category: 'Health', description: 'Doctor Appointment', amount: -85.00, method: 'Debit Card', status: 'completed' },
  ]);

  const [filters, setFilters] = useState({
    category: 'All Categories',
    status: 'All Status',
    dateRange: 'Last 30 Days',
  });

  const [showModal, setShowModal] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    date: '',
    category: 'Food & Dining',
    description: '',
    amount: '',
    method: 'Credit Card',
  });

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!newTransaction.date || !newTransaction.description || !newTransaction.amount) {
      alert('Please fill all fields');
      return;
    }
    const transaction = {
      id: Math.max(...transactions.map(t => t.id), 0) + 1,
      ...newTransaction,
      amount: parseFloat(newTransaction.amount),
      status: 'completed',
    };
    setTransactions([transaction, ...transactions]);
    setNewTransaction({
      date: '',
      category: 'Food & Dining',
      description: '',
      amount: '',
      method: 'Credit Card',
    });
    setShowModal(false);
  };

  const categories = ['All Categories', 'Food & Dining', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Health', 'Salary', 'Advertising'];

  return (
    <div className="transactions">
      <div className="page-header">
        <h1>Transactions</h1>
        <p>Manage and track your financial flow with precision.</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>All Transactions</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Add Expense
          </button>
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <div className="filter-group">
            <label>Last 30 Days</label>
            <select value={filters.dateRange} onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
              <option>This Year</option>
            </select>
          </div>

          <div className="filter-group">
            <label>All Categories</label>
            <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
              {categories.map(cat => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Payment Method</label>
            <select>
              <option>All Methods</option>
              <option>Credit Card</option>
              <option>Debit Card</option>
              <option>Bank Transfer</option>
              <option>Direct Deposit</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Status</label>
            <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
              <option>All Status</option>
              <option>Completed</option>
              <option>Pending</option>
            </select>
          </div>

          <button className="btn btn-secondary btn-small">More Filters</button>
        </div>

        {/* Transactions Table */}
        <div className="transactions-table">
          <div className="table-header">
            <div className="col col-date">Date</div>
            <div className="col col-category">Category</div>
            <div className="col col-description">Description</div>
            <div className="col col-amount">Amount</div>
            <div className="col col-method">Method</div>
            <div className="col col-status">Status</div>
            <div className="col col-actions">Actions</div>
          </div>

          <div className="table-body">
            {transactions.map(tx => (
              <div key={tx.id} className="table-row">
                <div className="col col-date">{tx.date}</div>
                <div className="col col-category">
                  <span className="category-badge">{tx.category}</span>
                </div>
                <div className="col col-description">{tx.description}</div>
                <div className="col col-amount">
                  <span className={tx.amount > 0 ? 'amount-income' : 'amount-expense'}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}
                  </span>
                </div>
                <div className="col col-method">{tx.method}</div>
                <div className="col col-status">
                  <span className={`status-badge ${tx.status}`}>{tx.status}</span>
                </div>
                <div className="col col-actions">
                  <button className="action-btn" title="Edit">✏️</button>
                  <button className="action-btn delete" title="Delete">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="pagination">
          <span>Showing 1 to 10 of 420 transactions</span>
          <div className="pagination-controls">
            <button disabled>←</button>
            <button className="active">1</button>
            <button>2</button>
            <button>3</button>
            <button>...</button>
            <button>42</button>
            <button>→</button>
          </div>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Transaction</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddTransaction}>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={newTransaction.date}
                  onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={newTransaction.category}
                  onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                >
                  {categories.slice(1).map(cat => (
                    <option key={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  placeholder="Enter transaction description"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Amount</label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  step="0.01"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Payment Method</label>
                <select
                  value={newTransaction.method}
                  onChange={(e) => setNewTransaction({ ...newTransaction, method: e.target.value })}
                >
                  <option>Credit Card</option>
                  <option>Debit Card</option>
                  <option>Bank Transfer</option>
                  <option>Direct Deposit</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Transactions;
