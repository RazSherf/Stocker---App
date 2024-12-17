import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import styles from './Navbar.module.css';

function Navbar() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <nav className={styles.navbar}>
      {/* <div className={styles.logo}>
        <img src="/Stocklogo.png" alt="Logo" className={styles.logoImage} />
      </div> */}
      <div className={styles.tabs}>
        {/* <a>Stocker</a> */}
        <a href="#home">Home</a>
        <a href="#products">Products</a>
        <a href="#reports">Reports</a>
      </div>
      <button onClick={toggleDarkMode} className={styles.darkModeToggle}>
        {darkMode ? '🌞' : '🌙'}
      </button>
    </nav>
  );
}

export default Navbar;

