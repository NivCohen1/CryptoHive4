import React from "react";
import "../styles/DarkModeToggle.css";

const DarkModeToggle = ({ darkMode, setDarkMode }) => {
  return (
    <div className="dark-mode-toggle">
      <input
        type="checkbox"
        className="checkbox"
        id="checkbox"
        checked={darkMode}
        onChange={() => setDarkMode(!darkMode)}
      />
      <label htmlFor="checkbox" className="checkbox-label">
        <i className="fas fa-moon"></i>
        <i className="fas fa-sun"></i>
        <span className="ball"></span>
      </label>
    </div>
  );
};

export default DarkModeToggle;
