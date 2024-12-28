import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"

function App() {
  // ... existing code ...

  return (
    <ThemeProvider value={{ darkMode, toggleDarkMode }}>
      <Router>
        <div className={`App ${darkMode ? "dark-mode" : ""}`}>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Navigate to="/inventory" replace />} />
              <Route path="/inventory" element={<ProductList />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  )
}