
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8050;

app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

app.get('/api/data', (req, res) => {
  const data = fs.readFileSync('./db.json', 'utf-8');
  res.json(JSON.parse(data));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
