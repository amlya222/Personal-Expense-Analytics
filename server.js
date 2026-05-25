const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;
const dataFile = path.join(__dirname, 'data', 'transactions.json');

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
