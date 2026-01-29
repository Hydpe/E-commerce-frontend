import React, { useState } from "react";
import axios from "axios";
import "./Signup.css";
import { User } from "../../Data/Interfaces";

interface SignupProps {
  setIsLoggedIn: (value: boolean) => void;
}

const Signup: React.FC<SignupProps> = ({ setIsLoggedIn }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8080/Users/signup",
        { name, email, password },
        { withCredentials: true }
      );
      setIsLoggedIn(true);
     // alert("Signup successful! Please login.");
    } catch (error) {
      console.error("Signup failed:", error);
      alert("Signup failed");
    }
  };
  return (
    <div className="signup-container">
      <h2>Create Account</h2>
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="button" onClick={handleSignup}>Signup</button>
    </div>
  );
};

export default Signup;
