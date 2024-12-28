import React, { useState } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Navbar from "./components/Navbar"
import ProductList from "./components/ProductList"
import { ThemeProvider } from "./contexts/ThemeContext"
import "./App.css"
import { RestockHistory } from "./components/Restoks"

function App() {
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <ThemeProvider value={{ darkMode, toggleDarkMode }}>
      <Router>
        <div className={`App ${darkMode ? "dark-mode" : ""}`}>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Navigate to="/inventory" replace />} />
              <Route path="/inventory" element={<ProductList />} />
              <Route path="/restocking" element={<RestockHistory />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App