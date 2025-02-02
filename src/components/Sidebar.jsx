import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = ({ predefinedCryptos }) => {
  const navigate = useNavigate();

  // Handle option click
  const handleOptionClick = (crypto) => {
    navigate(`/search?crypto=${crypto}`); // Navigate with the selected cryptocurrency
  };

  return (
    <div className="sidebar">
      
      <h3>Popular Cryptos</h3>
      {predefinedCryptos.map((crypto, index) => (
        <a
          key={index}
          onClick={() => handleOptionClick(crypto)}
          className="sidebar-link"
        >
          {crypto}
        </a>
      ))}
    </div>
  );
};

export default Sidebar;
