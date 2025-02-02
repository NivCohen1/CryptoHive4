import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/SearchResultsPage.css";

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [crypto, setCrypto] = useState("");
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(true); // State for sidebar visibility
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  });
  
  const API_KEY = "e084bcc89f0bf7339cebbc2c3c3ae2bd80cf3e0fbf3b1d89301c17f20e231c1c";

  // Extract `crypto` query from URL
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const selectedCrypto = query.get("crypto");
    if (!selectedCrypto) {
      navigate("/"); // Redirect if `crypto` is invalid
    } else {
      setCrypto(selectedCrypto);
    }
  }, [location, navigate]);

  // Fetch news whenever `crypto` or `selectedDate` changes
  useEffect(() => {
    if (!crypto || !selectedDate) return;

    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);

        const timestamp = Math.floor(new Date(selectedDate).getTime() / 1000); // Convert selectedDate to UNIX timestamp

        const response = await fetch(
          `https://min-api.cryptocompare.com/data/v2/news/?categories=${crypto}&lTs=${timestamp}&api_key=${API_KEY}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.Data && data.Data.length > 0) {
          setNews(data.Data);
          setFilteredNews(
            data.Data.filter((article) =>
              article.title.toLowerCase().includes(crypto.toLowerCase())
            )
          );
          console.log("Fetched News Data:", data.Data);
        } else {
          setNews([]);
          setFilteredNews([]);
          setError("No news found for the selected cryptocurrency.");
        }
      } catch (err) {
        setError("Failed to fetch news. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [crypto, selectedDate]);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarVisible((prev) => !prev);
  };

  // Navigate back to home page
  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="search-results-page">
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>
      {sidebarVisible && (
        <Sidebar
          predefinedCryptos={[
            "Bitcoin","Ethereum","Binance Coin","Tether","USD Coin","Ripple","Cardano",
            "Solana","Dogecoin","Polkadot","Uniswap","Litecoin","Chainlink","Bitcoin Cash"
            ,"Avalanche","Polygon","Stellar","VeChain","TRON","Filecoin","Ethereum Classic","Algorand","Tezos",
          ]}
        />
      )}
      <div className="results-container">
        <button className="menu-button" onClick={handleBackToHome}>
          Back to Home
        </button>
        <h2>Search Results for {crypto}</h2>

        
        {/* Date Picker */}
        <label htmlFor="date-picker">Show articles from:</label>
        <input
          type="date"
          id="date-picker"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />

        {loading ? (
          <p>Loading news...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : filteredNews.length > 0 ? (
          <div className="results-list">
            {filteredNews.map((article, index) => (
              <div key={index} className="result-card">
                <div className="image-container">
                  <img
                    src={article.imageurl || "/api/placeholder/200/100"}
                    alt={article.title}
                    className="result-image"
                  />
                </div>
                <div className="text-content">
                  <h3>{article.title}</h3>
                  <p>{article.body.slice(0, 150)}...</p>
                  <p className="result-date">
                    {new Date(article.published_on * 1000).toLocaleDateString()}
                  </p>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read More
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No news found for {crypto}.</p>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
