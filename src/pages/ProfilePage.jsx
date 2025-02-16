import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import "../styles/ProfilePage.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useCryptoLogos from "../components/useCryptoLogos";

/**
 * ProfilePage Component
 * ---------------------
 * This component displays the user's profile, allowing them to manage their favorite cryptocurrencies.
 * 
 * Features:
 * - Fetches the authenticated user's email and stored favorite cryptocurrencies.
 * - Displays a list of the top 30 most common cryptocurrencies with checkboxes for selection.
 * - Allows users to select/deselect favorite cryptocurrencies and save them to Firestore.
 * - Displays a success or error message upon saving favorites.
 */
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

  const { cryptoLogos, loading } = useCryptoLogos(availableCryptos);

  /**
   * Effect Hook: Monitors Firebase authentication state.
   * - Updates the `user` state with the current logged-in user.
   */
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  /**
   * Effect Hook: Fetches the user's favorite cryptocurrencies from Firestore.
   * - Only runs if the user is authenticated.
   */
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;
      try {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setFavorites(userDoc.data().favorites || []); // Set favorites from Firestore
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, [user]);

  // Handle selection/deselection of a cryptocurrency
  const handleFavoriteChange = (e) => {
    const selectedCrypto = e.target.value; // Ensure we are getting the correct value
    setFavorites((prevFavorites) =>
      prevFavorites.includes(selectedCrypto)
        ? prevFavorites.filter((fav) => fav !== selectedCrypto)
        : [...prevFavorites, selectedCrypto]
    );
  };  

  /**
   * Saves the selected favorite cryptocurrencies to Firestore.
   * - Merges the updated favorites array with the user's Firestore document.
   * - Displays a success or error message.
   */
  const handleSaveFavorites = async () => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      try {
        await setDoc(userRef, { favorites }, { merge: true }); // Merge new favorites into Firestore
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
      <h2>Welcome, {user?.email.split('@')[0]}! Here’s your profile.</h2>
      {user ? (
        <div>
          <button className="menu-button" onClick={handleBackToHome}>
            Back to Home
          </button>
          <p><strong>Email:</strong> {user.email}</p>
          <h3>Choose Your Favorite Cryptos:</h3>
          <div className="crypto-grid">
            {availableCryptos.map((crypto) => (
              <label
                key={crypto}
                className="crypto-item"
                onClick={(e) => {
                  e.preventDefault(); // Prevents checkbox default behavior
                  handleFavoriteChange({ target: { value: crypto } });
                }}
              >
                <input
                  type="checkbox"
                  id={`checkbox-${crypto}`}
                  value={crypto}
                  checked={favorites.includes(crypto)}
                  onChange={() => {}}
                />
                <img
                  src={cryptoLogos[crypto] || "/bee.jpg"}
                  alt={crypto}
                  className="crypto-logo"
                  onError={(e) => { e.target.src = "/bee.jpg"; }}
                />
                <span>{crypto}</span>
              </label>
            ))}
          </div>
          <button onClick={handleSaveFavorites}>Save Favorites</button>
          {saveStatus && <p className="save-status">{saveStatus}</p>}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
  
  
};
export default ProfilePage;
