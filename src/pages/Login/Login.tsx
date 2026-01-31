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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        "http://localhost:8080/Users/login",
        { email, password },
        { withCredentials: true }
      );

      const response2 = await axios.get<User>(
        "http://localhost:8080/Users/getProfile",
        { withCredentials: true }
      );

      setUserProfile(response2.data);
      setIsLoggedIn(true);

      if (location.state?.fromPdp) {
        navigate("/pdp/" + location.state.productId);
      } else {
        navigate("/");
      }
    } catch (err: any) {
      console.error("Login failed:", err);

      if (err.response?.status === 401) {
        setError("Invalid email or password");
      } else if (err.response?.status === 404) {
        setError("User not found. Please sign up first.");
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Login</h2>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter your password"
          />
        </div>

        <button
          className="login-button"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        <div className="signup-link">
          Don't have an account?{" "}
          <span onClick={() => navigate("/signup")}>Sign up</span>
        </div>
      </div>
    </div>
  );
};

export default Login;