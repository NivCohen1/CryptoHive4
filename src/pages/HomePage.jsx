import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import SearchComponent from "../components/SearchComponent"; // Import Search Component
import NewsList from "../components/NewsList"; // Import NewsList Component
import RunningBanner from "../components/RunningBanner"; // Import Running Banner
import "../styles/HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cryptos, setCryptos] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userFavorites, setUserFavorites] = useState([]); // Add user favorites state
  const [selectedCategory, setSelectedCategory] = useState("all"); // Add category state

  // Monitor Firebase Auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsLoggedIn(true);
        fetchUserFavorites(currentUser.uid); // Fetch user favorites on login
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch user's favorite cryptocurrencies from Firestore
  const fetchUserFavorites = async (uid) => {
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      setUserFavorites(userDoc.data().favorites || []);
    }
  };

  // Fetch cryptocurrency list
  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        const response = await fetch(
          `https://min-api.cryptocompare.com/data/all/coinlist?api_key=e084bcc89f0bf7339cebbc2c3c3ae2bd80cf3e0fbf3b1d89301c17f20e231c1c`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const cryptoNames = Object.values(data.Data).map((coin) => coin.CoinName);
        setCryptos(cryptoNames);
      } catch (error) {
        console.error("Error fetching cryptocurrency list:", error);
      }
    };

    fetchCryptos();
  }, []);

  // Fetch News with category and userFavorites filtering
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);

        const category = selectedCategory === "all" ? "" : selectedCategory;
        const response = await fetch(
          `https://min-api.cryptocompare.com/data/v2/news/?categories=${category}&api_key=e084bcc89f0bf7339cebbc2c3c3ae2bd80cf3e0fbf3b1d89301c17f20e231c1c`
        );
        const data = await response.json();

        let fetchedNews = data.Data || [];

        // Filter the news based on the user's selected favorite cryptos
        if (userFavorites.length > 0) {
          fetchedNews = fetchedNews.filter((article) =>
            userFavorites.some((crypto) =>
              article.title.toLowerCase().includes(crypto.toLowerCase())
            )
          );
        }

        setNews(fetchedNews);
      } catch (err) {
        console.error("Error fetching news:", err.message);
        setError("Failed to fetch news");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [selectedCategory, userFavorites]); // Re-fetch news when category or favorites change

  return (
    <div className="home-container">
      {/* Add Running Banner */}
      <RunningBanner />

      <main className="main-content">
        <section className="header-section">
          <img src="/logo.png" alt="CryptoHive Logo" className="logo" />
          <h1 className="site-title">CryptoHive</h1>
          <p className="site-description">Your gateway to cryptocurrency insights and trends.</p>

          {/* Use the modular SearchComponent here */}
          <SearchComponent cryptos={cryptos} />

          {/* Bee Animation under the search bar */}
          {loading && (
            <div className="bee-animation-container">
              <img src="/bee.jpg" alt="Bee Animation" className="bee" />
            </div>
          )}
        </section>

        {/* Use NewsList component for displaying news */}
        <NewsList news={news} loading={loading} error={error} />
      </main>
    </div>
  );
};

export default HomePage;
