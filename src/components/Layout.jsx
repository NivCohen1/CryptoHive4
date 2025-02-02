import React, { useState, useEffect } from "react";
import Header from "./Header";
import { auth } from "../firebase";

const Layout = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setIsLoggedIn(!!currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className={`layout-container ${darkMode ? "dark" : ""}`}>
      <Header isLoggedIn={isLoggedIn} user={user} darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="main-content">{children}</main>
    </div>
  );
};

export default Layout;
