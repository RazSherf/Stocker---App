import React, { useState } from "react"
import Navbar from "./components/Navbar"
import ProductList from "./components/ProductList"
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
          <ProductList />
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App
