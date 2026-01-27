import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Products from "./pages/Products/Products";

import Pdp from "./pages/Pdp/Pdp";
import Cart from "./pages/Cart/Cart";
import CheckOut from "./pages/CheckOut/CheckOut";
import Order from "./pages/Order/Order";
import Profile from "./pages/Profile/Profile";

import { User } from "./Data/Interfaces";


axios.defaults.withCredentials = true;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<User | null>(null);

  useEffect(() => {
    //  Check session on page load
    axios
      .get<User>("http://localhost:8080/Users/getProfile")
      .then((res) => {
        if (res.data) {
          setUserProfile(res.data);
          setIsLoggedIn(true);
        }
      })
      .catch(() => {
        setUserProfile(null);
        setIsLoggedIn(false);
      });
  }, []);

  return (
    <Router>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

        <Header
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          setUserProfile={setUserProfile}
        />

        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/products1" element={<Products />} />
            <Route path="/products2" element={<Products />} />
            <Route
              path="/login"
              element={<Login setIsLoggedIn={setIsLoggedIn} setUserProfile={setUserProfile} />}
            />
            <Route path="/signup" element={<Signup setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/cart" element={<Cart userProfile={userProfile} />} />
            <Route path="/pdp/:id" element={<Pdp IsLoggedIn={isLoggedIn} userProfile={userProfile} />} />
            <Route
              path="/checkOut/:id"
              element={<CheckOut userProfile={userProfile} setUserProfile={setUserProfile} />}
            />
            <Route path="/order" element={<Order />} />
            <Route path="/profile" element={<Profile userProfile={userProfile} />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
