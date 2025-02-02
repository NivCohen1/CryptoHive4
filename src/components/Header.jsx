import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import DarkModeToggle from "./DarkModeToggle";
import "../styles/Header.css";

const Header = ({ isLoggedIn, user, darkMode, setDarkMode }) => {
  const navigate = useNavigate();

  const handleLoginClick = () => navigate("/login");
  const handleSignUpClick = () => navigate("/signup");
  const handleProfilePageClick = () => navigate("/profile");

  const handleLogoutClick = () => {
    auth.signOut()
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error logging out: ", error);
      });
  };

  return (
    <header className="auth-header">
      <div className="auth-buttons">
        {isLoggedIn ? (
          <div className="auth-logged-in">
            <div className="user-name">{user?.displayName || user?.email}</div>
            <button className="auth-button profile" onClick={handleProfilePageClick}>
              Profile
            </button>
            <button className="auth-button logout" onClick={handleLogoutClick}>
              Logout
            </button>
          </div>
        ) : (
          <>
            <button className="auth-button login" onClick={handleLoginClick}>
              Login
            </button>
            <button className="auth-button signup" onClick={handleSignUpClick}>
              Sign Up
            </button>
          </>
        )}
        <div className="dark-mode-toggle-container">
          <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        </div>
      </div>
    </header>
  );
};

export default Header;
