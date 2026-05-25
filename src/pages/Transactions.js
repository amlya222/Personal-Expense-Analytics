import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Transactions.css';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'All Categories',
    status: 'All Status',
    dateRange: 'Last 30 Days',
  });

  const [showModal, setShowModal] = useState(false);
  const [editingTransactionId, setEditingTransactionId] = useState(null);
  const [newTransaction, setNewTransaction] = useState({
    date: '',
    category: 'Food & Dining',
    description: '',
    amount: '',
    method: 'Credit Card',
    status: 'completed',
  });

  const resetForm = () => {
    setEditingTransactionId(null);
    setNewTransaction({
      date: '',
      category: 'Food & Dining',
      description: '',
      amount: '',
      method: 'Credit Card',
      status: 'completed',
    });
  };

  const closeModal = () => {
    resetForm();
    setShowModal(false);
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/transactions`);
      setTransactions(response.data);
    } catch (error) {
      console.error('Failed to fetch transactions', error);
      alert('Unable to load transactions from the backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleAddTransaction = async (e) => {
    e.preventDefault();

    if (!newTransaction.date || !newTransaction.description || !newTransaction.amount) {
      alert('Please fill all fields');
      return;
    }

    const transactionToSave = {
      ...newTransaction,
      amount: parseFloat(newTransaction.amount),
      status: newTransaction.status || 'completed',
    };

    try {
      if (editingTransactionId) {
        const response = await axios.put(`${apiBaseUrl}/api/transactions/${editingTransactionId}`, transactionToSave);
        setTransactions(transactions.map((tx) => (tx.id === editingTransactionId ? response.data : tx)));
      } else {
        const response = await axios.post(`${apiBaseUrl}/api/transactions`, transactionToSave);
        setTransactions([response.data, ...transactions]);
      }

      closeModal();
    } catch (error) {
      console.error('Failed to save transaction', error);
      alert('Unable to save transaction. Please try again.');
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await axios.delete(`${apiBaseUrl}/api/transactions/${id}`);
      setTransactions(transactions.filter((tx) => tx.id !== id));
    } catch (error) {
      console.error('Failed to delete transaction', error);
      alert('Unable to delete transaction.');
    }
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransactionId(transaction.id);
    setNewTransaction({
      date: transaction.date,
      category: transaction.category,
      description: transaction.description,
      amount: transaction.amount.toString(),
      method: transaction.method,
      status: transaction.status || 'completed',
    });
    setShowModal(true);
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
          <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
            + Add Expense
          </button>
        </div>

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
              {categories.map((cat) => (
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

        {loading ? (
          <div className="loading-state">Loading transactions...</div>
        ) : (
          <>
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
                {transactions.map((tx) => (
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
                      <button className="action-btn" title="Edit" onClick={() => handleEditTransaction(tx)}>
                        ✏️
                      </button>
                      <button className="action-btn delete" title="Delete" onClick={() => handleDeleteTransaction(tx.id)}>
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pagination">
              <span>Showing 1 to {transactions.length} of {transactions.length} transactions</span>
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
          </>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingTransactionId ? 'Edit Transaction' : 'Add New Transaction'}</h2>
              <button className="close-btn" onClick={closeModal}>✕</button>
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
                  {categories.slice(1).map((cat) => (
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
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingTransactionId ? 'Save Changes' : 'Add Transaction'}
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
