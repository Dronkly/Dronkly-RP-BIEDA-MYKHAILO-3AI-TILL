import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState("Načítám zprávu z backendu...")

  useEffect(() => {
    fetch("http://localhost:5000/api/hello")
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(() => setMessage("Nepodařilo se připojit k backendu ❌"))
  }, [])

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Moje Home stránka 🏠</h1>
      <h2>{message}</h2>
    </div>
  )
}

export default App