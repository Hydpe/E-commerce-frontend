import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

interface HeaderProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  setUserProfile: (user: any) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const Header: React.FC<HeaderProps> = ({
  isLoggedIn,
  setIsLoggedIn,
  setUserProfile,
  searchTerm,
  setSearchTerm,
}) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8080/Users/logout", {
        method: "POST",
        credentials: "include",
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
     <Link to="/products1" className="logo"> <img src="https://s3-us-west-2.amazonaws.com/issuewireassets/primg/101141/techouts-new-logo130104215.png" alt="Techouts Logo" className="logo-img" /> </Link>


      <div className="header-center">
        <input
          type="text"
          placeholder="Search products..."
          className="search-box"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <nav className="nav-right">
        <Link to="/products1" className="nav-link">
          Mobiles
        </Link>

        <Link to="/products2" className="nav-link">
          Laptops
        </Link>

        {isLoggedIn && (
          <Link to="/cart" className="nav-link">
            Cart
          </Link>
        )}

        {isLoggedIn ? (
          <>
            <Link to="/profile" className="nav-link">
              My Profile
            </Link>

            <button onClick={handleLogout} className="nav-link logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>

            <Link to="/signup" className="nav-link signup-link">
              Signup
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
