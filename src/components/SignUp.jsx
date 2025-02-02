import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import "../styles/SignUp.css";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      // Create the user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user information in Firestore with an empty favorites array
      await setDoc(doc(db, "users", user.uid), {
        email,
        uid: user.uid,
        favorites: [], // Initialize with an empty array
      });

      alert("Sign-Up Successful!");
      navigate("/"); // Redirect to home page
    } catch (err) {
      setError(err.message);
    }
  };

    // Navigate back to home page
    const handleBackToHome = () => {
      navigate("/");
    };

  return (
    <div className="signup-page">
      <button className="menu-button" onClick={handleBackToHome}>
        Back to Home
      </button>
      <form onSubmit={handleSignUp}>
        <h2>Sign Up</h2>
        {error && <p className="error-message">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
