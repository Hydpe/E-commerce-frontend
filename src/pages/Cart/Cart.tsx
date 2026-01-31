import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User } from "../../Data/Interfaces";
import "./Cart.css";

interface CartProps {
  userProfile: User | null;
  setUserProfile: React.Dispatch<React.SetStateAction<User | null>>;
}

const Cart: React.FC<CartProps> = ({ userProfile, setUserProfile }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    axios
      .get<User>("http://localhost:8080/Users/getProfile", {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data) {
          setUserProfile(res.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch profile:", err);
        setError("Failed to load cart. Please try again.");
        setUserProfile(null);
        setLoading(false);
      });
  }, [setUserProfile]);

  const handleDelete = async (productId: number) => {
    setDeletingId(productId);
    setError("");

    try {
      const res = await axios.delete(
        `http://localhost:8080/Cart/${productId}`,
        { withCredentials: true }
      );

      setUserProfile((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          cart: res.data,
        };
      });
    } catch (err: any) {
      console.error("Delete failed:", err);
      if (err.response?.status === 401) {
        setError("Please login to manage your cart");
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Failed to remove item. Please try again.");
      }
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="cart-loading">
        <div className="spinner"></div>
        <h2>Loading your cart...</h2>
      </div>
    );
  }

  if (
    !userProfile ||
    !userProfile.cart ||
    userProfile.cart.products.length === 0
  ) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-icon"></div>
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added anything yet.</p>
        <button className="continue-shopping-btn" onClick={() => navigate("/")}>
          Continue Shopping
        </button>
      </div>
    );
  }

  const totalPrice = userProfile.cart.products.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0
  );

  return (
    <div className="cart-container">
      {/* Error Message */}
      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={() => setError("")}>×</button>
        </div>
      )}

      {/* Header */}
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <p className="item-count">
          {userProfile.cart.products.length} {userProfile.cart.products.length === 1 ? 'item' : 'items'}
        </p>
      </div>

      {/* Cart Items */}
      <div className="cart-content">
        <div className="cart-items">
          {userProfile.cart.products.map((product) => (
            <div key={product.id} className="cart-item">
              <img
                src={product.image}
                alt={product.productName}
                className="cart-item-image"
              />

              <div className="cart-item-details">
                <h3>{product.productName}</h3>
                <p className="cart-item-price">₹{product.price.toLocaleString()}</p>
                <p className="cart-item-quantity">Quantity: {product.quantity}</p>
              </div>

              <button
                className="delete-btn"
                onClick={() => handleDelete(product.id)}
                disabled={deletingId === product.id}
              >
                {deletingId === product.id ? (
                  <>
                    <div className="btn-spinner"></div>
                    Removing...
                  </>
                ) : (
                  <>
                     Remove
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="cart-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{totalPrice.toLocaleString()}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span>₹40</span>
          </div>

          <div className="summary-divider"></div>

          <div className="summary-row total">
            <span>Total</span>
            <span>₹{(totalPrice + 40).toLocaleString()}</span>
          </div>

          <button
            className="checkout-btn"
            onClick={() =>
              navigate("/checkOut/" + userProfile.id, {
                state: { userProfile },
              })
            }
          >
            Proceed to Checkout
          </button>

          <button
            className="continue-btn"
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;