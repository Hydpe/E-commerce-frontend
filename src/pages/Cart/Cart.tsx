import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User } from "../../Data/Interfaces";

interface CartProps {
  userProfile: User | null;
  setUserProfile: React.Dispatch<React.SetStateAction<User | null>>;
}

const Cart: React.FC<CartProps> = ({ userProfile, setUserProfile }) => {
  const navigate = useNavigate();

  if (!userProfile || !userProfile.cart || userProfile.cart.products.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
          textAlign: "center",
          background: "linear-gradient(135deg, #e0f2fe, #fef9c3)",
          borderRadius: "16px",
          padding: "40px",
          margin: "40px auto",
          maxWidth: "500px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ fontSize: "28px", fontWeight: 700 }}>
          Your Cart is Empty
        </h2>
        <p style={{ color: "#475569", marginBottom: "20px" }}>
          Looks like you haven't added anything yet.
        </p>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "12px 24px",
            backgroundColor: "#0ea5e9",
            color: "#fff",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

const handleDelete = async (productId: number) => {
  try {
    const res = await axios.delete(
      `http://localhost:8080/Cart/${productId}`,
      { withCredentials: true }
    );


    const updatedCart = res.data;

    setUserProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        cart: updatedCart,
      };
    });

  } catch (error) {
    console.error("Delete failed:", error);
    alert("Failed to delete product");
    alert(productId);
  }
};

  const totalPrice = userProfile.cart.products.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0
  );

  return (
    <div style={{ padding: "20px" }}>
      <button
        style={{
          padding: "12px 20px",
          backgroundColor: "#38bdf8",
          color: "#0f172a",
          fontWeight: 600,
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
        onClick={() =>
          navigate("/checkOut/" + userProfile.id, {
            state: { userProfile },
          })
        }
      >
        CheckOut
      </button>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {userProfile.cart.products.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ccc",
              padding: "12px",
              borderRadius: "8px",
              width: "200px",
              textAlign: "center",
            }}
          >
            <img
              src={product.image}
              alt={product.productName}
              style={{
                width: "100%",
                height: "150px",
                objectFit: "contain",
                marginBottom: "10px",
              }}
            />
            <h3>{product.productName}</h3>
            <p style={{ fontWeight: "bold" }}>₹{product.price}</p>

            <button
              onClick={() => handleDelete(product.id)}
              style={{
                marginTop: "10px",
                padding: "8px 12px",
                backgroundColor: "#ef4444",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: "30px",
          textAlign: "right",
          fontSize: "18px",
          fontWeight: "bold",
        }}
      >
        Total Price: ₹{totalPrice}
      </div>
    </div>
  );
};

export default Cart;
