import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

interface HeaderProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;        //  Added
  setUserProfile: (user: any) => void;          //  Added
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, setIsLoggedIn, setUserProfile }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      //  Call backend logout endpoint
      await fetch("http://localhost:8080/Users/logout", {
        method: "POST",
        credentials: "include", // send session cookie
      });

      setIsLoggedIn(false);
      setUserProfile(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <header className="header">
      <h2> Techouts Ecommerce</h2>
      <nav>
        <Link to="/products1" className="nav-link">Mobiles</Link>
        <Link to="/products2" className="nav-link">Lpatops</Link>
        {isLoggedIn && <Link to="/cart" className="nav-link">Cart</Link>}

        {isLoggedIn ? (
          <>
            <Link to="/profile" className="nav-link">MyProfile</Link>

            <button onClick={handleLogout} className="nav-link" style={{ cursor: "pointer", border: "none", background: "none" }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="nav-link signup-link">Signup</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
