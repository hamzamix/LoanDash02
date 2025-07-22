import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 8050;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFilePath = path.join(__dirname, 'db.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/api/debts', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
    res.json(data);
  } catch {
    res.status(500).json({ error: "Failed to read debt data" });
  }
});

app.post('/api/debts', (req, res) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(req.body, null, 2));
    res.json({ message: "Saved successfully" });
  } catch {
    res.status(500).json({ error: "Failed to save debt data" });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
