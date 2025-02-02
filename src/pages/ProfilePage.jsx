import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import "../styles/ProfilePage.css";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [saveStatus, setSaveStatus] = useState(""); // State to track save status
  const navigate = useNavigate();

  // Hard-coded list of the top 30 most common cryptocurrencies
  const availableCryptos = [
    "Bitcoin", "Ethereum", "Binance Coin", "Tether", "USD Coin", 
    "Ripple", "Cardano", "Solana", "Dogecoin", "Polkadot", 
    "Uniswap", "Litecoin", "Chainlink", "Bitcoin Cash", "Avalanche", 
    "Polygon", "Stellar", "VeChain", "TRON", "Filecoin", 
    "Ethereum Classic", "Algorand", "Tezos", "Cosmos", "Monero", 
    "EOS", "Zcash", "Shiba Inu", "Aave", "IOTA", "Maker"
  ];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Fetch user's favorite cryptocurrencies from Firestore
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;
      try {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setFavorites(userDoc.data().favorites || []);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, [user]);

  // Handle selection/deselection of a cryptocurrency
  const handleFavoriteChange = (e) => {
    const selectedCrypto = e.target.value;
    const updatedFavorites = favorites.includes(selectedCrypto)
      ? favorites.filter((fav) => fav !== selectedCrypto)
      : [...favorites, selectedCrypto];
    setFavorites(updatedFavorites);
  };

  // Save favorites to Firestore
  const handleSaveFavorites = async () => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      try {
        await setDoc(userRef, { favorites }, { merge: true });
        setSaveStatus("Favorites Saved!"); // Show confirmation message
        setTimeout(() => {
          setSaveStatus(""); // Hide the message after 2 seconds
        }, 2000);
      } catch (error) {
        console.error("Error saving favorites:", error);
        setSaveStatus("Error saving favorites, please try again.");
      }
    }
  };

  // Navigate back to the home page
  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="profile-page">
      <h2>Your Profile</h2>
      {user ? (
        <div>
          <button className="menu-button" onClick={handleBackToHome}>
            Back to Home
          </button>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <h3>Your Favorite Cryptos</h3>
          <ul className="favorites-list">
            {availableCryptos.map((crypto) => (
              <li key={crypto}>
                <label>
                  <input
                    type="checkbox"
                    value={crypto}
                    checked={favorites.includes(crypto)}
                    onChange={handleFavoriteChange}
                  />
                  {crypto}
                </label>
              </li>
            ))}
          </ul>
          <button onClick={handleSaveFavorites}>Save Favorites</button>
          {saveStatus && <p className="save-status">{saveStatus}</p>} {/* Display status message */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ProfilePage;
