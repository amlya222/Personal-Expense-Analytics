import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

function Dashboard() {
  const [month] = useState('October 2023');

  const summaryData = [
    { label: 'Total Income', value: '$124,592.00', icon: '📈', change: '+12%' },
    { label: 'Monthly Savings', value: '$8,400.00', icon: '💾', change: '+5%' },
    { label: 'Total Budget', value: '$15,200.00', icon: '💰', change: '-2%' },
    { label: 'Budget Alert', value: '$6,840.00', icon: '⚠️', change: 'Over Budget' },
  ];

  const chartData = [
    { month: 'Jan', income: 8000, expenses: 5200 },
    { month: 'Feb', income: 9200, expenses: 5800 },
    { month: 'Mar', income: 8800, expenses: 6200 },
    { month: 'Apr', income: 10200, expenses: 6800 },
    { month: 'May', income: 9500, expenses: 5900 },
    { month: 'Jun', income: 11200, expenses: 7200 },
  ];

  const categoryData = [
    { name: 'Food & Dining', value: 2400, color: '#10b981' },
    { name: 'Transport', value: 2210, color: '#f44336' },
    { name: 'Entertainment', value: 2290, color: '#2196f3' },
    { name: 'Utilities', value: 2000, color: '#ff9800' },
    { name: 'Health', value: 1500, color: '#9c27b0' },
  ];

  const recentTransactions = [
    { id: 1, date: 'Oct 24, 2023', category: 'Food & Dining', amount: '-$42.50', method: 'Credit Card', status: 'completed' },
    { id: 2, date: 'Oct 23, 2023', category: 'Ad Campaign', amount: '-$2,850.00', method: 'Bank Transfer', status: 'pending' },
    { id: 3, date: 'Oct 22, 2023', category: 'Client Dinner', amount: '-$185.20', method: 'Debit Card', status: 'completed' },
    { id: 4, date: 'Oct 21, 2023', category: 'Payout', amount: '+$12,400.00', method: 'Direct Deposit', status: 'completed' },
  ];

  const categoryBudgets = [
    { category: 'Home', budget: '$2,500/$2,500', progress: 87 },
    { category: 'Food & Dining', budget: '$850/$950', progress: 71 },
    { category: 'Transport', budget: '$420/$400', budget_alert: true, progress: 105 },
  ];

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's your financial overview</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-4">
        {summaryData.map((item, idx) => (
          <div key={idx} className="summary-card">
            <div className="summary-header">
              <span className="summary-icon">{item.icon}</span>
              <span className={`change ${item.change.includes('Over') ? 'alert' : 'positive'}`}>
                {item.change}
              </span>
            </div>
            <p className="summary-label">{item.label}</p>
            <p className="summary-value">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-2">
        {/* Line Chart */}
        <div className="card">
          <div className="card-header">
            <h2>Financial Performance</h2>
            <div className="chart-controls">
              <button className="filter-btn">Monthly</button>
              <button className="filter-btn">Quarterly</button>
              <button className="filter-btn">Yearly</button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="var(--primary)" strokeWidth={2} />
              <Line type="monotone" dataKey="expenses" stroke="var(--danger)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="card">
          <div className="card-header">
            <h2>Spending Categories</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Progress & Recent Transactions */}
      <div className="grid grid-2">
        {/* Category Progress */}
        <div className="card">
          <div className="card-header">
            <h2>Category Progress</h2>
            <button className="btn btn-small btn-secondary">View All Categories</button>
          </div>
          <div className="category-list">
            {categoryBudgets.map((item, idx) => (
              <div key={idx} className="category-item">
                <div className="category-info">
                  <p className="category-name">{item.category}</p>
                  <p className="category-budget">{item.budget}</p>
                </div>
                <div className="progress-bar">
                  <div 
                    className={`progress-fill ${item.budget_alert ? 'alert' : ''}`}
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
                <span className="progress-percent">{item.progress}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <div className="card-header">
            <h2>Recent Transactions</h2>
            <button className="btn btn-small btn-secondary">View All</button>
          </div>
          <div className="transaction-list">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="transaction-item">
                <div className="transaction-info">
                  <p className="transaction-category">{tx.category}</p>
                  <p className="transaction-method">{tx.method}</p>
                </div>
                <div className="transaction-details">
                  <p className="transaction-amount">{tx.amount}</p>
                  <span className={`status ${tx.status}`}>{tx.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Smart Insights */}
      <div className="card">
        <div className="card-header">
          <h2>💡 Smart Insights</h2>
        </div>
        <div className="insights-grid">
          <div className="insight-item">
            <h3>Reduced Overspending</h3>
            <p>Your dining expenses decreased by 23% compared to last month. Keep it up to reach your savings goal 2 weeks earlier.</p>
          </div>
          <div className="insight-item alert">
            <h3>Upcoming Bills</h3>
            <p>3 recurring subscriptions totaling $85.00 are due within the next 4 days.</p>
          </div>
          <div className="insight-item">
            <h3>Budget Alert</h3>
            <p>Transport category has exceeded the monthly budget. Consider reducing unnecessary trips.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
