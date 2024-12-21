import React, { useState } from "react"
import Navbar from "./components/Navbar"
import ProductManagement from "./components/ProductList"
import { ThemeProvider } from "./contexts/ThemeContext"
import "./App.css"

function App() {
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <ThemeProvider value={{ darkMode, toggleDarkMode }}>
      <div className={`App ${darkMode ? "dark-mode" : ""}`}>
        <Navbar />
        <main>
          <ProductManagement />
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App
