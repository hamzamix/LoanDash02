import React from 'react'
import ReactDOM from 'react-dom/client'

const App = () => {
  const [debts, setDebts] = React.useState([])
  const [input, setInput] = React.useState("")

  const load = async () => {
    const res = await fetch("/api/debts")
    const data = await res.json()
    setDebts(data)
  }

  const save = async () => {
    const updated = [...debts, input]
    await fetch("/api/debts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated)
    })
    setInput("")
    load()
  }

  React.useEffect(() => {
    load()
  }, [])

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>LoanDash</h1>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={save}>Add</button>
      <ul>
        {debts.map((d, i) => <li key={i}>{d}</li>)}
      </ul>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)