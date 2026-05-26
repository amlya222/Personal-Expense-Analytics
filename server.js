const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;
const dataFile = path.join(__dirname, 'data', 'transactions.json');
const budgetsFile = path.join(__dirname, 'data', 'budgets.json');
const settingsFile = path.join(__dirname, 'data', 'settings.json');

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

app.use(cors());
app.use(express.json());

async function readTransactions() {
  try {
    const raw = await fs.readFile(dataFile, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function writeTransactions(transactions) {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(transactions, null, 2), 'utf8');
}

async function readSettings() {
  try {
    const raw = await fs.readFile(settingsFile, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return defaultSettings;
    }
    throw error;
  }
}

async function writeSettings(settings) {
  await fs.mkdir(path.dirname(settingsFile), { recursive: true });
  await fs.writeFile(settingsFile, JSON.stringify(settings, null, 2), 'utf8');
}

async function readBudgets() {
  try {
    const raw = await fs.readFile(budgetsFile, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function writeBudgets(budgets) {
  await fs.mkdir(path.dirname(budgetsFile), { recursive: true });
  await fs.writeFile(budgetsFile, JSON.stringify(budgets, null, 2), 'utf8');
}

function getCurrencySymbol(currency) {
  if (!currency) return '$';
  const s = String(currency).toUpperCase();
  if (s.includes('INR')) return '₹';
  if (s.includes('USD')) return '$';
  if (s.includes('EUR')) return '€';
  if (s.includes('GBP')) return '£';
  return s.split(/\s|-/)[0] || '$';
}

function buildBudgetResponse(budgets, transactions, currencySymbol) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const monthlySpentByCategory = transactions.reduce((acc, tx) => {
    const amount = Number(tx.amount || 0);
    if (amount >= 0) return acc;
    const date = new Date(tx.date);
    if (Number.isNaN(date.getTime())) return acc;
    if (date.getFullYear() !== currentYear || date.getMonth() !== currentMonth) return acc;

    const category = tx.category || 'Other';
    acc[category] = (acc[category] || 0) + Math.abs(amount);
    return acc;
  }, {});

  return budgets.map((budget) => {
    const spent = Number((monthlySpentByCategory[budget.category] || 0).toFixed(2));
    const totalBudget = Number(budget.budget || 0);
    const remaining = Number((totalBudget - spent).toFixed(2));
    const progress = totalBudget > 0 ? Math.min((spent / totalBudget) * 100, 100) : 0;
    const status = spent > totalBudget ? 'over' : 'on-track';

    return {
      id: budget.id,
      category: budget.category,
      icon: budget.icon || '💰',
      budget: totalBudget,
      spent,
      remaining,
      progress: Number(progress.toFixed(0)),
      status,
      budget_alert: spent > totalBudget,
      currencySymbol,
    };
  });
}

app.get('/api/settings', async (req, res) => {
  try {
    const settings = await readSettings();
    res.json(settings);
  } catch (error) {
    console.error('GET /api/settings error', error);
    res.status(500).json({ message: 'Failed to read settings.' });
  }
});

app.put('/api/settings', async (req, res) => {
  const payload = req.body;

  if (!payload || typeof payload !== 'object') {
    return res.status(400).json({ message: 'Settings payload is required.' });
  }

  try {
    const settings = {
      ...defaultSettings,
      ...payload,
      notifications: {
        ...defaultSettings.notifications,
        ...(payload.notifications || {}),
      },
      security: {
        ...defaultSettings.security,
        ...(payload.security || {}),
      },
    };

    await writeSettings(settings);
    res.json(settings);
  } catch (error) {
    console.error('PUT /api/settings error', error);
    res.status(500).json({ message: 'Failed to save settings.' });
  }
});

app.get('/api/analytics', async (req, res) => {
  try {
    const transactions = await readTransactions();
    const settings = await readSettings();

    const currency = settings.currency || 'USD';
    const currencySymbol = (function () {
      const s = String(currency).toUpperCase();
      if (s.includes('INR')) return '₹';
      if (s.includes('USD')) return '$';
      if (s.includes('EUR')) return '€';
      if (s.includes('GBP')) return '£';
      return s.split(/\s|-/)[0] || '$';
    })();

    const now = new Date();
    const months = new Map();
    const categoryTotals = {};
    const dailyTotals = {};
    const weeklyTotals = {};
    let totalExpenses = 0;
    let expenseDays = new Set();

    transactions.forEach((tx) => {
      const amount = Number(tx.amount || 0);
      const date = new Date(tx.date);
      if (Number.isNaN(date.getTime())) return;
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = date.toLocaleString('default', { month: 'short' });
      const weekKey = `${date.getFullYear()}-W${Math.ceil((date.getDate() + 6 - date.getDay()) / 7)}`;
      const dayKey = date.toISOString().slice(0, 10);

      if (!months.has(monthKey)) {
        months.set(monthKey, { month: monthLabel, income: 0, expenses: 0 });
      }
      const monthRow = months.get(monthKey);
      if (amount >= 0) {
        monthRow.income += amount;
      } else {
        monthRow.expenses += Math.abs(amount);
      }

      if (amount < 0) {
        const category = tx.category || 'Other';
        categoryTotals[category] = (categoryTotals[category] || 0) + Math.abs(amount);
        totalExpenses += Math.abs(amount);
        expenseDays.add(dayKey);
      }

      dailyTotals[dayKey] = (dailyTotals[dayKey] || 0) + Math.abs(amount < 0 ? amount : 0);
      weeklyTotals[weekKey] = (weeklyTotals[weekKey] || 0) + Math.abs(amount < 0 ? amount : 0);
    });

    const sortedMonthKeys = Array.from(months.keys()).sort();
    const monthlyData = sortedMonthKeys
      .slice(-6)
      .map((key) => ({
        month: months.get(key).month,
        income: Number(months.get(key).income.toFixed(2)),
        expenses: Number(months.get(key).expenses.toFixed(2)),
        savings: Number((months.get(key).income - months.get(key).expenses).toFixed(2)),
      }));

    const spendingTrend = Object.entries(weeklyTotals)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-4)
      .map(([week, spending]) => ({ week, spending: Number(spending.toFixed(2)) }));

    const categorySpending = Object.entries(categoryTotals)
      .map(([category, value]) => ({ category, value: Number(value.toFixed(2)), percentage: 0 }))
      .sort((a, b) => b.value - a.value);

    const totalCategoryValue = categorySpending.reduce((sum, item) => sum + item.value, 0);
    categorySpending.forEach((item) => {
      item.percentage = totalCategoryValue ? Number(((item.value / totalCategoryValue) * 100).toFixed(0)) : 0;
    });

    const topExpenses = categorySpending.slice(0, 5).map((entry) => ({
      category: entry.category,
      amount: Number(entry.value.toFixed(2)),
      percentage: entry.percentage,
    }));

    const averageDailySpending = expenseDays.size ? Number((totalExpenses / expenseDays.size).toFixed(2)) : 0;
    const highestDay = Object.entries(dailyTotals).sort((a, b) => b[1] - a[1])[0] || [null, 0];
    const mostSpentCategory = categorySpending[0] || { category: 'N/A', value: 0 };
    const budgetHealthValue = totalExpenses ? Math.max(0, Math.min(100, 100 - (totalExpenses / 20000) * 100)) : 100;

    const metrics = [
      { label: 'Average Daily Spending', value: `${currencySymbol}${averageDailySpending}`, change: totalExpenses ? '-5.2%' : '0%' },
      { label: 'Highest Spending Day', value: highestDay[0] ? new Date(highestDay[0]).toLocaleDateString() : 'N/A', amount: `${currencySymbol}${Number(highestDay[1]).toFixed(2)}` },
      { label: 'Most Spent Category', value: mostSpentCategory.category, amount: `${currencySymbol}${mostSpentCategory.value.toFixed(2)}` },
      { label: 'Budget Health', value: `${budgetHealthValue.toFixed(0)}%`, status: totalExpenses > 16000 ? 'Warning' : 'Good' },
    ];

    const categoryAnalysis = categorySpending.slice(0, 4).map((item, idx) => ({
      category: item.category,
      current: Number(item.value.toFixed(2)),
      budget: Number((item.value * 1.2).toFixed(2)),
      remaining: Number((item.value * 0.2).toFixed(2)),
      status: item.value > 0 ? 'On Track' : 'Review',
      color: ['#10b981', '#f44336', '#2196f3', '#ff9800'][idx % 4],
    }));

    const insights = [
      `Your food expenses are ${categoryTotals['Food & Dining'] ? `${Math.round((categoryTotals['Food & Dining'] / totalExpenses) * 100)}%` : 'N/A'} of total spending.`,
      `You're saving an average of ${currencySymbol}${averageDailySpending.toFixed(2)} per day based on expense history.`,
      `Transport costs are ${categoryTotals['Transport'] ? `${Math.round((categoryTotals['Transport'] / totalExpenses) * 100)}%` : 'N/A'} of total spending.`,
    ];

    const budgetAlerts = [
      ...(categoryTotals['Entertainment'] && categoryTotals['Entertainment'] > 1500 ? ['Entertainment category approaching limit'] : []),
      ...(categoryTotals['Utilities'] && categoryTotals['Utilities'] > 1500 ? [`Utilities exceeded budget by ${currencySymbol}150`] : []),
      ...(categoryTotals['Shopping'] && categoryTotals['Shopping'] > 1200 ? ['Shopping category usage increased 12%'] : []),
    ];

    res.json({
      currencySymbol,
      metrics,
      monthlyData,
      categorySpending,
      spendingTrend,
      topExpenses,
      categoryAnalysis,
      insights,
      budgetAlerts,
    });
  } catch (error) {
    console.error('GET /api/analytics error', error);
    res.status(500).json({ message: 'Failed to load analytics data.' });
  }
});

app.get('/api/budgets', async (req, res) => {
  try {
    const budgets = await readBudgets();
    const transactions = await readTransactions();
    const settings = await readSettings();
    const currencySymbol = getCurrencySymbol(settings.currency);
    const budgetData = buildBudgetResponse(budgets, transactions, currencySymbol);
    res.json({ currencySymbol, budgets: budgetData });
  } catch (error) {
    console.error('GET /api/budgets error', error);
    res.status(500).json({ message: 'Failed to load budgets.' });
  }
});

app.post('/api/budgets', async (req, res) => {
  try {
    const { category, budget, icon } = req.body;
    if (!category || budget === undefined || budget === null) {
      return res.status(400).json({ message: 'Category and budget amount are required.' });
    }

    const budgets = await readBudgets();
    const nextId = budgets.length ? Math.max(...budgets.map((item) => item.id)) + 1 : 1;
    const newBudget = {
      id: nextId,
      category,
      budget: Number(budget),
      icon: icon || '💰',
    };

    budgets.push(newBudget);
    await writeBudgets(budgets);

    const settings = await readSettings();
    const currencySymbol = getCurrencySymbol(settings.currency);
    const budgetData = buildBudgetResponse(budgets, await readTransactions(), currencySymbol);

    res.status(201).json({ currencySymbol, budgets: budgetData });
  } catch (error) {
    console.error('POST /api/budgets error', error);
    res.status(500).json({ message: 'Failed to save budget.' });
  }
});

app.put('/api/budgets/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { category, budget, icon } = req.body;
    if (!category || budget === undefined || budget === null) {
      return res.status(400).json({ message: 'Category and budget amount are required.' });
    }

    const budgets = await readBudgets();
    const index = budgets.findIndex((item) => item.id === id);
    if (index === -1) {
      return res.status(404).json({ message: 'Budget not found.' });
    }

    budgets[index] = {
      ...budgets[index],
      category,
      budget: Number(budget),
      icon: icon || budgets[index].icon || '💰',
    };
    await writeBudgets(budgets);

    const settings = await readSettings();
    const currencySymbol = getCurrencySymbol(settings.currency);
    const budgetData = buildBudgetResponse(budgets, await readTransactions(), currencySymbol);

    res.json({ currencySymbol, budgets: budgetData });
  } catch (error) {
    console.error(`PUT /api/budgets/${req.params.id} error`, error);
    res.status(500).json({ message: 'Failed to update budget.' });
  }
});

app.delete('/api/budgets/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const budgets = await readBudgets();
    const updated = budgets.filter((item) => item.id !== id);
    if (updated.length === budgets.length) {
      return res.status(404).json({ message: 'Budget not found.' });
    }
    await writeBudgets(updated);
    res.sendStatus(204);
  } catch (error) {
    console.error(`DELETE /api/budgets/${req.params.id} error`, error);
    res.status(500).json({ message: 'Failed to delete budget.' });
  }
});

app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await readTransactions();
    res.json(transactions);
  } catch (error) {
    console.error('GET /api/transactions error', error);
    res.status(500).json({ message: 'Failed to read transactions.' });
  }
});

app.post('/api/transactions', async (req, res) => {
  const { date, category, description, amount, method, status } = req.body;

  if (!date || !description || amount === undefined || amount === null) {
    return res.status(400).json({ message: 'Date, description, and amount are required.' });
  }

  try {
    const transactions = await readTransactions();
    const nextId = transactions.length ? Math.max(...transactions.map((tx) => tx.id)) + 1 : 1;
    const newTransaction = {
      id: nextId,
      date,
      category: category || 'Food & Dining',
      description,
      amount: Number(amount),
      method: method || 'Credit Card',
      status: status || 'completed',
    };

    const updated = [newTransaction, ...transactions];
    await writeTransactions(updated);
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error('POST /api/transactions error', error);
    res.status(500).json({ message: 'Failed to save transaction.' });
  }
});

app.put('/api/transactions/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { date, category, description, amount, method, status } = req.body;

  if (!date || !description || amount === undefined || amount === null) {
    return res.status(400).json({ message: 'Date, description, and amount are required.' });
  }

  try {
    const transactions = await readTransactions();
    const existing = transactions.find((tx) => tx.id === id);

    if (!existing) {
      return res.status(404).json({ message: 'Transaction not found.' });
    }

    const updatedTransaction = {
      ...existing,
      date,
      category: category || existing.category,
      description,
      amount: Number(amount),
      method: method || existing.method,
      status: status || existing.status,
    };

    const updated = transactions.map((tx) => (tx.id === id ? updatedTransaction : tx));
    await writeTransactions(updated);
    res.json(updatedTransaction);
  } catch (error) {
    console.error(`PUT /api/transactions/${id} error`, error);
    res.status(500).json({ message: 'Failed to update transaction.' });
  }
});

app.get('/api/dashboard', async (req, res) => {
  try {
    const transactions = await readTransactions();
    const settings = await readSettings();

    function getCurrencySymbol(currency) {
      if (!currency) return '$';
      const s = String(currency).toUpperCase();
      if (s.includes('INR')) return '₹';
      if (s.includes('USD')) return '$';
      if (s.includes('EUR')) return '€';
      if (s.includes('GBP')) return '£';
      // fallback to currency code or first token
      const token = s.split(/\s|-/)[0];
      return token || '$';
    }

    const currencySymbol = getCurrencySymbol(settings.currency);

    const totals = transactions.reduce(
      (acc, tx) => {
        if (tx.amount >= 0) {
          acc.income += tx.amount;
        } else {
          acc.expenses += Math.abs(tx.amount);
        }
        return acc;
      },
      { income: 0, expenses: 0 }
    );

    const formatCurrency = (n) => `${currencySymbol}${Number(n).toFixed(2)}`;

    const summaryData = [
      { label: 'Total Income', value: formatCurrency(totals.income), icon: '📈', change: '+12%' },
      { label: 'Monthly Savings', value: formatCurrency(totals.income - totals.expenses), icon: '💾', change: '+5%' },
      { label: 'Total Budget', value: `${currencySymbol}15200.00`, icon: '💰', change: '-2%' },
      { label: 'Budget Alert', value: `${currencySymbol}6840.00`, icon: '⚠️', change: totals.expenses > 15200 ? 'Over Budget' : 'Within Budget' },
    ];

    const monthMap = {};
    transactions.forEach((tx) => {
      const parsed = new Date(tx.date);
      if (Number.isNaN(parsed.getTime())) {
        return;
      }
      const key = `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, '0')}`;
      const label = parsed.toLocaleString('default', { month: 'short' });
      monthMap[key] = monthMap[key] || { month: label, income: 0, expenses: 0, date: parsed };
      if (tx.amount >= 0) {
        monthMap[key].income += tx.amount;
      } else {
        monthMap[key].expenses += Math.abs(tx.amount);
      }
    });

    const chartData = Object.values(monthMap)
      .sort((a, b) => a.date - b.date)
      .slice(-6)
      .map(({ month, income, expenses }) => ({ month, income, expenses }));

    const categoryCounts = {};
    transactions.forEach((tx) => {
      if (tx.amount >= 0) {
        return;
      }
      categoryCounts[tx.category] = (categoryCounts[tx.category] || 0) + Math.abs(tx.amount);
    });

    const categoryData = Object.entries(categoryCounts).map(([name, value], index) => ({
      name,
      value,
      color: ['#10b981', '#f44336', '#2196f3', '#ff9800', '#9c27b0'][index % 5],
    }));

    const recentTransactions = transactions
      .slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 4)
      .map((tx) => ({
        id: tx.id,
        date: tx.date,
        category: tx.category,
        amount: `${tx.amount >= 0 ? '+' : '-'}${currencySymbol}${Math.abs(tx.amount).toFixed(2)}`,
        method: tx.method,
        status: tx.status,
      }));

    const categoryBudgets = [
      { category: 'Home', budget: `${currencySymbol}2500/${currencySymbol}2500`, progress: 87 },
      { category: 'Food & Dining', budget: `${currencySymbol}850/${currencySymbol}950`, progress: 71 },
      { category: 'Transport', budget: `${currencySymbol}420/${currencySymbol}400`, budget_alert: true, progress: 105 },
    ];

    res.json({ summaryData, chartData, categoryData, recentTransactions, categoryBudgets });
  } catch (error) {
    console.error('GET /api/dashboard error', error);
    res.status(500).json({ message: 'Failed to load dashboard data.' });
  }
});

app.delete('/api/transactions/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    const transactions = await readTransactions();
    const updated = transactions.filter((tx) => tx.id !== id);
    await writeTransactions(updated);
    res.sendStatus(204);
  } catch (error) {
    console.error(`DELETE /api/transactions/${id} error`, error);
    res.status(500).json({ message: 'Failed to delete transaction.' });
  }
});

app.listen(port, () => {
  console.log(`Backend server listening on http://localhost:${port}`);
});
