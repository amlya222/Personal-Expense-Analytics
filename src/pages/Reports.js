import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Reports.css';

function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const monthlyReportData = [
    { month: 'January', income: 8000, expenses: 5200, savings: 2800 },
    { month: 'February', income: 9200, expenses: 5800, savings: 3400 },
    { month: 'March', income: 8800, expenses: 6200, savings: 2600 },
    { month: 'April', income: 10200, expenses: 6800, savings: 3400 },
    { month: 'May', income: 9500, expenses: 5900, savings: 3600 },
    { month: 'June', income: 11200, expenses: 7200, savings: 4000 },
  ];

  const quarterlyReportData = [
    { quarter: 'Q1 2023', income: 26000, expenses: 17200, savings: 8800 },
    { quarter: 'Q2 2023', income: 30900, expenses: 19900, savings: 11000 },
    { quarter: 'Q3 2023', income: 28500, expenses: 18900, savings: 9600 },
    { quarter: 'Q4 2023', income: 32100, expenses: 21300, savings: 10800 },
  ];

  const reports = [
    {
      id: 1,
      name: 'Monthly Expense Report - June 2023',
      type: 'Monthly',
      date: 'June 30, 2023',
      status: 'Generated',
      icon: '📄',
    },
    {
      id: 2,
      name: 'Quarterly Summary - Q2 2023',
      type: 'Quarterly',
      date: 'June 30, 2023',
      status: 'Generated',
      icon: '📊',
    },
    {
      id: 3,
      name: 'Annual Report - 2023',
      type: 'Annual',
      date: 'December 31, 2023',
      status: 'Scheduled',
      icon: '📈',
    },
    {
      id: 4,
      name: 'Budget vs Actual - May 2023',
      type: 'Budget Analysis',
      date: 'May 31, 2023',
      status: 'Generated',
      icon: '💰',
    },
    {
      id: 5,
      name: 'Category Breakdown - June 2023',
      type: 'Category Analysis',
      date: 'June 30, 2023',
      status: 'Generated',
      icon: '📋',
    },
  ];

  const summaryStats = [
    { label: 'Total Income', value: '$124,800', change: '+8.5%' },
    { label: 'Total Expenses', value: '$78,200', change: '+3.2%' },
    { label: 'Total Savings', value: '$46,600', change: '+15.2%' },
    { label: 'Savings Rate', value: '37.3%', change: '+2.1%' },
  ];

  const expenseBreakdown = [
    { category: 'Food & Dining', amount: 14400, percentage: 18.4 },
    { category: 'Transport', amount: 10800, percentage: 13.8 },
    { category: 'Utilities', amount: 12000, percentage: 15.3 },
    { category: 'Entertainment', amount: 9200, percentage: 11.8 },
    { category: 'Shopping', amount: 10400, percentage: 13.3 },
    { category: 'Health', amount: 8200, percentage: 10.5 },
    { category: 'Others', amount: 2800, percentage: 3.6 },
  ];

  return (
    <div className="reports">
      <div className="page-header">
        <h1>Reports</h1>
        <p>Generate and view comprehensive financial reports</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-4">
        {summaryStats.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <p className="stat-label">{stat.label}</p>
            <p className="stat-value">{stat.value}</p>
            <span className="stat-change positive">{stat.change}</span>
          </div>
        ))}
      </div>

      {/* Period Selector */}
      <div className="card">
        <div className="card-header">
          <h2>Financial Overview</h2>
          <div className="period-selector">
            <button
              className={`period-tab ${selectedPeriod === 'month' ? 'active' : ''}`}
              onClick={() => setSelectedPeriod('month')}
            >
              Monthly
            </button>
            <button
              className={`period-tab ${selectedPeriod === 'quarter' ? 'active' : ''}`}
              onClick={() => setSelectedPeriod('quarter')}
            >
              Quarterly
            </button>
          </div>
        </div>

        {selectedPeriod === 'month' && (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={monthlyReportData}>
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
        )}

        {selectedPeriod === 'quarter' && (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={quarterlyReportData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="quarter" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="var(--primary)" strokeWidth={2} />
              <Line type="monotone" dataKey="expenses" stroke="var(--danger)" strokeWidth={2} />
              <Line type="monotone" dataKey="savings" stroke="var(--success)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Expense Breakdown */}
      <div className="card">
        <div className="card-header">
          <h2>Expense Breakdown</h2>
          <button className="btn btn-primary btn-small">Download Report</button>
        </div>
        <div className="expense-breakdown-table">
          <div className="breakdown-header">
            <div className="col">Category</div>
            <div className="col">Amount</div>
            <div className="col">Percentage</div>
            <div className="col">Visual</div>
          </div>
          {expenseBreakdown.map((item, idx) => (
            <div key={idx} className="breakdown-row">
              <div className="col category">{item.category}</div>
              <div className="col amount">${item.amount.toLocaleString()}</div>
              <div className="col">{item.percentage}%</div>
              <div className="col visual">
                <div className="breakdown-bar">
                  <div className="breakdown-fill" style={{ width: `${item.percentage}%` }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reports List */}
      <div className="card">
        <div className="card-header">
          <h2>Generated Reports</h2>
          <button className="btn btn-primary">+ Generate New Report</button>
        </div>

        <div className="reports-list">
          {reports.map(report => (
            <div key={report.id} className={`report-item ${report.status.toLowerCase()}`}>
              <div className="report-info">
                <span className="report-icon">{report.icon}</span>
                <div className="report-details">
                  <h3>{report.name}</h3>
                  <p className="report-type">{report.type} • {report.date}</p>
                </div>
              </div>
              <div className="report-actions">
                <span className={`report-status ${report.status.toLowerCase()}`}>
                  {report.status}
                </span>
                <button className="action-icon" title="Download">⬇️</button>
                <button className="action-icon" title="View">👁️</button>
                <button className="action-icon" title="Share">📤</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h2>Quick Actions</h2>
        </div>
        <div className="quick-actions-grid">
          <button className="quick-action-btn">
            <span className="qa-icon">📅</span>
            <span className="qa-label">Monthly Report</span>
          </button>
          <button className="quick-action-btn">
            <span className="qa-icon">📊</span>
            <span className="qa-label">Quarterly Report</span>
          </button>
          <button className="quick-action-btn">
            <span className="qa-icon">📈</span>
            <span className="qa-label">Annual Report</span>
          </button>
          <button className="quick-action-btn">
            <span className="qa-icon">💾</span>
            <span className="qa-label">Export to PDF</span>
          </button>
          <button className="quick-action-btn">
            <span className="qa-icon">📧</span>
            <span className="qa-label">Email Report</span>
          </button>
          <button className="quick-action-btn">
            <span className="qa-icon">🔔</span>
            <span className="qa-label">Schedule Report</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Reports;
