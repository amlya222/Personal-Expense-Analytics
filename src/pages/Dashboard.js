import React, { useEffect, useState } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import './Dashboard.css';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [categoryBudgets, setCategoryBudgets] = useState([]);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/dashboard`);
      const { summaryData, chartData, categoryData, recentTransactions, categoryBudgets } = response.data;
      setSummaryData(summaryData);
      setChartData(chartData);
      setCategoryData(categoryData);
      setRecentTransactions(recentTransactions);
      setCategoryBudgets(categoryBudgets);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
      const message = err.response?.data?.message || err.message || 'Unable to load dashboard data.';
      setError(`Unable to load dashboard data. ${message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    const onUpdate = () => fetchDashboard();
    window.addEventListener('settings:updated', onUpdate);
    return () => window.removeEventListener('settings:updated', onUpdate);
  }, []);

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's your financial overview.</p>
      </div>

      {loading ? (
        <div className="loading-state">Loading dashboard data...</div>
      ) : error ? (
        <div className="error-state">{error}</div>
      ) : (
        <>
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

          <div className="grid grid-2">
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

          <div className="grid grid-2">
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
        </>
      )}
    </div>
  );
}

export default Dashboard;
