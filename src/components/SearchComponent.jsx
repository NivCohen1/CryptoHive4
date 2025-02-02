import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchComponent = ({ cryptos = [] }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCryptos, setFilteredCryptos] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearchChange = (e) => {
    const input = e.target.value;
    setSearchTerm(input);

    if (input && cryptos.length > 0) {
      const matches = cryptos.filter((crypto) =>
        crypto.toLowerCase().includes(input.toLowerCase())
      );
      setFilteredCryptos(matches.slice(0, 10));
    } else {
      setFilteredCryptos([]);
    }
  };

  const handleSearch = () => {
    if (searchTerm) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        navigate(`/search?crypto=${searchTerm}`);
      }, 2000);
    } else {
      alert("Please enter a cryptocurrency to search.");
    }
  };

  const handleSearchSelect = (crypto) => {
    setSearchTerm(crypto);
    setFilteredCryptos([]); // Clear the dropdown
  };

  return (
    <div className="search-container">
      {/* Search Bar and Dropdown Wrapper */}
      <div className="search-bar-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="Search for a cryptocurrency..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>

        {/* Dropdown for suggestions */}
        {filteredCryptos.length > 0 && (
          <ul className="dropdown-menu">
            {filteredCryptos.map((crypto, index) => (
              <li
                key={index}
                className="dropdown-item"
                onClick={() => handleSearchSelect(crypto)}
              >
                {crypto}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Bee Animation */}
      {loading && (
        <div className="bee-animation-container">
          <img src="/bee.jpg" alt="Bee Animation" className="bee" />
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
