import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User } from "../../Data/Interfaces";
import "./Signup.css";

interface SignupProps {
  setIsLoggedIn: (value: boolean) => void;
  setUserProfile: (user: User) => void; // NEW: pass setUserProfile
}

const Signup: React.FC<SignupProps> = ({ setIsLoggedIn, setUserProfile }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleSignup = async () => {
    setErrorMsg(""); // clear old error

    if (!name || !email || !password) {
      setErrorMsg("All fields are required");
      return;
    }

    try {

      await axios.post(
        "http://localhost:8080/Users/signup",
        { name, email, password },
        { withCredentials: true }
      );
      await axios.post(
        "http://localhost:8080/Users/login",
        { email, password },
        { withCredentials: true } // send cookie
      );

      const response = await axios.get<User>(
        "http://localhost:8080/Users/getProfile",
        { withCredentials: true }
      );

      setUserProfile(response.data); // Set profile
      setIsLoggedIn(true);           // Mark logged in

      // Redirect to products page
      navigate("/products1");
    } catch (error: any) {
      if (error.response?.status === 409) {
        setErrorMsg("User already exists");
      } else {
        setErrorMsg("Signup failed. Please try again.");
      }
    }
  };

  return (
    <div className="signup-container">
      <h2>Create Account</h2>

      {errorMsg && <p className="error-text">{errorMsg}</p>}

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="button" onClick={handleSignup}>
        Signup
      </button>
    </div>
  );
};

export default Signup;
