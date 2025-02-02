import React from 'react';

const SearchBar = ({ searchTerm, filteredCryptos, handleSearchChange, handleSearch, handleSearchSelect }) => {
  return (
    <div className="search-container">
      <input 
        type="text"
        className="search-input"
        placeholder="Search for a cryptocurrency..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <button className="search-button" onClick={handleSearch}>Search</button>
      
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
  );
};

export default SearchBar;
