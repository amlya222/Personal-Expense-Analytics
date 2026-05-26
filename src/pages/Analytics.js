import React, { useEffect, useState } from 'react';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import './Analytics.css';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

function Analytics() {
  const [metrics, setMetrics] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categorySpending, setCategorySpending] = useState([]);
  const [spendingTrend, setSpendingTrend] = useState([]);
  const [topExpenses, setTopExpenses] = useState([]);
  const [categoryAnalysis, setCategoryAnalysis] = useState([]);
  const [currencySymbol, setCurrencySymbol] = useState('$');
  const [insights, setInsights] = useState([]);
  const [budgetAlerts, setBudgetAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const colors = ['#10b981', '#f44336', '#2196f3', '#ff9800', '#9c27b0', '#00bcd4'];

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${apiBaseUrl}/api/analytics`);
        const data = response.data;
        setCurrencySymbol(data.currencySymbol || '$');
        setMetrics(data.metrics || []);
        setMonthlyData(data.monthlyData || []);
        setCategorySpending(data.categorySpending || []);
        setSpendingTrend(data.spendingTrend || []);
        setTopExpenses(data.topExpenses || []);
        setCategoryAnalysis(data.categoryAnalysis || []);
        setInsights(data.insights || []);
        setBudgetAlerts(data.budgetAlerts || []);
      } catch (err) {
        console.error('Failed to load analytics data', err);
        setError(err.response?.data?.message || 'Unable to load analytics data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="analytics">
        <div className="page-header">
          <h1>Analytics</h1>
          <p>Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics">
        <div className="page-header">
          <h1>Analytics</h1>
          <p>Detailed insights into your spending patterns and financial behavior</p>
        </div>
        <div className="error-state">{error}</div>
      </div>
    );
  }

  return (
    <div className="analytics">
      <div className="page-header">
        <h1>Analytics</h1>
        <p>Detailed insights into your spending patterns and financial behavior</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-4">
        {metrics.map((metric, idx) => (
          <div key={idx} className="metric-card">
            <p className="metric-label">{metric.label}</p>
            <p className="metric-value">{metric.value}</p>
            {metric.amount && <p className="metric-subtitle">{metric.amount}</p>}
            {metric.change && <span className="metric-change">{metric.change}</span>}
            {metric.status && <span className="metric-status">{metric.status}</span>}
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-2">
        {/* Income vs Expenses */}
        <div className="card">
          <div className="card-header">
            <h2>Income vs Expenses</h2>
            <div className="chart-period">
              <button className="period-btn active">Month</button>
              <button className="period-btn">Quarter</button>
              <button className="period-btn">Year</button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" fill="var(--primary)" />
              <Bar dataKey="expenses" fill="var(--danger)" />
              <Bar dataKey="savings" fill="var(--success)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Spending Over Time */}
        <div className="card">
          <div className="card-header">
            <h2>Spending Trend</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={spendingTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="spending" fill="rgba(108, 45, 226, 0.1)" stroke="var(--primary)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Breakdown & Top Expenses */}
      <div className="grid grid-2">
        {/* Category Breakdown */}
        <div className="card">
          <div className="card-header">
            <h2>Category Breakdown</h2>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={categorySpending}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, percentage }) => `${category}: ${percentage}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categorySpending.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Expenses */}
        <div className="card">
          <div className="card-header">
            <h2>Top Expenses</h2>
          </div>
          <div className="expense-list">
            {topExpenses.map((expense, idx) => (
              <div key={idx} className="expense-item">
                <div className="expense-info">
                  <p className="expense-category">{expense.category}</p>
                  <div className="expense-bar">
                    <div
                      className="expense-bar-fill"
                      style={{ width: `${expense.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="expense-amount">
                  <p className="amount">{currencySymbol}{Number(expense.amount).toFixed(2)}</p>
                  <span className="percentage">{expense.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Category Analysis */}
      <div className="card">
        <div className="card-header">
          <h2>Category Analysis</h2>
        </div>
        <div className="category-table">
          <div className="category-table-header">
            <div className="cat-col">Category</div>
            <div className="cat-col">Current</div>
            <div className="cat-col">Budget</div>
            <div className="cat-col">Remaining</div>
            <div className="cat-col">Status</div>
          </div>
          {categoryAnalysis.map((cat, idx) => (
            <div key={idx} className="category-table-row">
              <div className="cat-col">
                <span className="category-badge" style={{ backgroundColor: cat.color || colors[idx] }}></span>
                {cat.category}
              </div>
              <div className="cat-col">{cat.current !== undefined ? `${currencySymbol}${Number(cat.current).toFixed(2)}` : '-'}</div>
              <div className="cat-col">{cat.budget !== undefined ? `${currencySymbol}${Number(cat.budget).toFixed(2)}` : '-'}</div>
              <div className="cat-col">{cat.remaining !== undefined ? `${currencySymbol}${Number(cat.remaining).toFixed(2)}` : '-'}</div>
              <div className="cat-col">
                <span className={`status-badge ${cat.status === 'Good' || cat.status === 'On Track' ? 'in-budget' : 'alert'}`}>{cat.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Savings Insights */}
      <div className="card">
        <div className="card-header">
          <h2>💡 Savings Insights</h2>
        </div>
        <div className="insights-container">
          <div className="insight-box">
            <h3>Smart Insights</h3>
            <ul className="insights-list">
              {insights.length ? insights.map((item, idx) => <li key={idx}>{item}</li>) : <li>No insights available yet.</li>}
            </ul>
          </div>
          <div className="insight-box warning">
            <h3>Budget Alerts</h3>
            <ul className="insights-list">
              {budgetAlerts.length ? budgetAlerts.map((item, idx) => <li key={idx}>{item}</li>) : <li>No budget alerts at this time.</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
