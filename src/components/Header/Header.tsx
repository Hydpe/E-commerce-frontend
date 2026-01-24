// src/components/Header/Header.tsx
import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

interface HeaderProps {
  isLoggedIn: boolean;
}

const Header = ({ isLoggedIn }: HeaderProps) => {
  return (
    <header className="header">
      <h2>Ecommerce</h2>
      <nav>
        <Link to="/" className="nav-link">Products</Link>
        {isLoggedIn && <Link to="/cart" className="nav-link">Cart</Link>}

        {isLoggedIn ? (
          <Link to="/profile" className="nav-link">MyProfile</Link>
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
