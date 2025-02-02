import React from "react";
import "../styles/Footer.css"; // Make sure to create and style the Footer.css file.

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} CryptoHive. All Rights Reserved.</p>
    </footer>
    
  );
};

export default Footer;