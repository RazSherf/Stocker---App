import React, { useState } from "react"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"
import Navbar from "./components/Navbar"
import { ThemeProvider } from "./contexts/ThemeContext"
import "./App.css"
import ProductList from "./components/Products/ProductList"
import { RestockHistory } from "./components/Restocks/RestokHistory"
import WorkInProgress from "./components/WorkInProgress/WorkInProgress"
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
            <div className="content-container">
              <Routes>
                <Route
                  path="/"
                  element={<Navigate to="/inventory" replace />}
                />
                <Route path="/inventory" element={<ProductList />} />
                <Route path="/restocking" element={<RestockHistory />} />
                <Route
                  path="/analytics"
                  element={
                    <WorkInProgress
                      title="Analytics Page"
                      message="Coming Soon"
                    />
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <WorkInProgress
                      title="Profile page"
                      message="Coming Soon!"
                    />
                  }
                />
              </Routes>
            </div>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
