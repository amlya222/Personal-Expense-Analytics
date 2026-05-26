const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;
const dataFile = path.join(__dirname, 'data', 'transactions.json');
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
