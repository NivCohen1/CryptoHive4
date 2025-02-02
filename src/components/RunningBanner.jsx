import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/RunningBanner.css";

const RunningBanner = () => {
  const [cryptoData, setCryptoData] = useState([]);

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await axios.get(
          "https://min-api.cryptocompare.com/data/top/totalvolfull",
          {
            params: {
              limit: 10, // Number of top cryptocurrencies to fetch
              tsym: "USD", // Prices in USD
              api_key: "8bb2137b2ae34650d6e4b802560ccc47aea05dffaea5018a163fe437b3b54060", // Replace with your API key
            },
          }
        );

        const data = response.data.Data.map((crypto) => ({
          name: crypto.CoinInfo.FullName,
          price: parseFloat(crypto.RAW.USD.PRICE).toFixed(2),
          change: parseFloat(crypto.RAW.USD.CHANGEPCT24HOUR).toFixed(2),
        }));

        setCryptoData(data);
      } catch (error) {
        console.error("Error fetching crypto data:", error);
      }
    };

    fetchCryptoData();
  }, []);

  return (
    <div className="running-banner">
      <div className="running-banner-content">
        {cryptoData.map((crypto, index) => (
          <span key={index} className="crypto-item">
            <strong>{crypto.name}</strong>: ${crypto.price} (
            {crypto.change > 0 ? "+" : ""}
            {crypto.change}%)
          </span>
        ))}
      </div>
    </div>
  );
};

export default RunningBanner;
