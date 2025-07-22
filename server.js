import express from 'express';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 8050;

const dataFile = path.join(process.cwd(), 'db.json');

app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'dist')));

app.get('/api/data', (req, res) => {
  const content = fs.existsSync(dataFile) ? fs.readFileSync(dataFile, 'utf-8') : '[]';
  res.json(JSON.parse(content));
});

app.post('/api/data', (req, res) => {
  fs.writeFileSync(dataFile, JSON.stringify(req.body, null, 2));
  res.json({ status: 'ok' });
});

app.listen(PORT, '0.0.0.0', () => console.log(`Server listening on port ${PORT}`));
