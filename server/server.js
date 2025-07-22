import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()
const PORT = process.env.PORT || 8050

const dbPath = path.join(__dirname, 'db.json')

app.use(express.json())
app.use(express.static(path.join(__dirname, 'dist')))

app.get('/api/debts', (req, res) => {
  if (!fs.existsSync(dbPath)) return res.json([])
  const data = fs.readFileSync(dbPath, 'utf-8')
  res.json(JSON.parse(data || '[]'))
})

app.post('/api/debts', (req, res) => {
  fs.writeFileSync(dbPath, JSON.stringify(req.body, null, 2))
  res.json({ status: 'ok' })
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'))
})

app.listen(PORT, () => {
  console.log("Server running on port", PORT)
})