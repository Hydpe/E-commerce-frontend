import React, { useState } from "react";
import axios from "axios";
import "./Login.css";
import { User } from "../../Data/Interfaces";
import { useNavigate, useLocation } from "react-router-dom";

interface LoginProps {
  setIsLoggedIn: (value: boolean) => void;
  setUserProfile: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ setIsLoggedIn, setUserProfile }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (email === "" || password === "") {
      alert("Please fill all fields");
      return;
    }

    try {
      //  POST to backend login — session cookie set automatically
      await axios.post(
        "http://localhost:8080/Users/login",
        { email, password },
        { withCredentials: true } // send cookie
      );

      //  Get profile using session cookie
      const response2 = await axios.get<User>("http://localhost:8080/Users/getProfile", { withCredentials: true });
      setUserProfile(response2.data);
      setIsLoggedIn(true);
     //  alert("Login success");

      if (location.state?.fromPdp) {
        navigate("/pdp/" + location.state.productId);
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <div className="form-group">
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button className="login-button" onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
