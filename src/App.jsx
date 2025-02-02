import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { auth } from "./firebase";
import HomePage from "./pages/HomePage";
import Layout from "./components/Layout";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import ProfilePage from "./pages/ProfilePage";
import SearchResultsPage from "./pages/SearchResultsPage"; // Import the search page
import Footer from "./components/footer"; // Import Footer

const App = () => {
  return (
    <Router>
      <div className="app">
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/search" element={<SearchResultsPage />} />
        </Routes>
      </Layout>
        <Footer /> 
      </div>
    </Router>
  );
};

export default App;
