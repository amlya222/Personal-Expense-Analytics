import React from 'react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './Analytics.css';

function Analytics() {
  const monthlyData = [
    { month: 'Jan', income: 8000, expenses: 5200, savings: 2800 },
    { month: 'Feb', income: 9200, expenses: 5800, savings: 3400 },
    { month: 'Mar', income: 8800, expenses: 6200, savings: 2600 },
    { month: 'Apr', income: 10200, expenses: 6800, savings: 3400 },
    { month: 'May', income: 9500, expenses: 5900, savings: 3600 },
    { month: 'Jun', income: 11200, expenses: 7200, savings: 4000 },
  ];

  const categorySpending = [
    { category: 'Food & Dining', value: 2400, percentage: 24 },
    { category: 'Transport', value: 1800, percentage: 18 },
    { category: 'Entertainment', value: 1500, percentage: 15 },
    { category: 'Utilities', value: 2000, percentage: 20 },
    { category: 'Shopping', value: 1300, percentage: 13 },
    { category: 'Health', value: 1000, percentage: 10 },
  ];

  const colors = ['#10b981', '#f44336', '#2196f3', '#ff9800', '#9c27b0', '#00bcd4'];

  const spendingTrend = [
    { week: 'W1', spending: 1200 },
    { week: 'W2', spending: 1450 },
    { week: 'W3', spending: 1100 },
    { week: 'W4', spending: 1650 },
  ];

  const topExpenses = [
    { category: 'Groceries', amount: 450, percentage: 15 },
    { category: 'Rent', amount: 1200, percentage: 40 },
    { category: 'Entertainment', amount: 300, percentage: 10 },
    { category: 'Transport', amount: 250, percentage: 8 },
    { category: 'Dining Out', amount: 320, percentage: 11 },
  ];

  const metrics = [
    { label: 'Average Daily Spending', value: '$85.50', change: '-5.2%' },
    { label: 'Highest Spending Day', value: 'Friday', amount: '$450' },
    { label: 'Most Spent Category', value: 'Rent', amount: '$1,200' },
    { label: 'Budget Health', value: '78%', status: 'Good' },
  ];

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
                  <p className="amount">${expense.amount}</p>
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
          {categorySpending.slice(0, 4).map((cat, idx) => (
            <div key={idx} className="category-table-row">
              <div className="cat-col">
                <span className="category-badge" style={{ backgroundColor: colors[idx] }}></span>
                {cat.category}
              </div>
              <div className="cat-col">${cat.value}</div>
              <div className="cat-col">${Math.floor(cat.value * 1.2)}</div>
              <div className="cat-col">${Math.floor(cat.value * 0.2)}</div>
              <div className="cat-col">
                <span className="status-badge in-budget">On Track</span>
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
              <li>Your food expenses increased by 23% in the past month</li>
              <li>You're saving an average of $3,467 per month</li>
              <li>Transport costs are 5% higher than usual</li>
              <li>Consider reducing dining expenses to meet savings goals</li>
            </ul>
          </div>
          <div className="insight-box warning">
            <h3>Budget Alerts</h3>
            <ul className="insights-list">
              <li>Entertainment category approaching limit</li>
              <li>Utilities exceeded budget by $150</li>
              <li>Shopping category usage increased 12%</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
