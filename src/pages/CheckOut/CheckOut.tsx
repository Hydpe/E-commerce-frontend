import { useNavigate, useLocation } from "react-router-dom";
import { User } from "../../Data/Interfaces";
import { useState } from "react";
import axios from "axios";

interface CheckOutProps {
  userProfile: User | null;
  setUserProfile: (user: User) => void;
}

const CheckOut: React.FC<CheckOutProps> = ({ userProfile, setUserProfile }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [address, setAddress] = useState("");
  const [number, setNumber] = useState("");

  const stateData = location.state as { userProfile?: User };
  const userData = stateData?.userProfile || userProfile;

  if (!userData || !userData.cart || userData.cart.products.length === 0) {
    return <div>No checkout data available</div>;
  }

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login again");
        return;
      }

      const response = await axios.put(
        "http://localhost:8080/Users/order",
        null,
        {
          params: {
            token,
            address,
            phone: number,
          },
        }
      );

      const updatedUser: User = response.data;

      // update global state
      setUserProfile(updatedUser);


      navigate("/order", {
        state: {
          userProfile: updatedUser,
        },
      });

    } catch (error) {
      console.error("Order Failed:", error);
      alert("Order Failed");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Checkout</h1>

      <h2>Name: {userData.name}</h2>
      <p>Email: {userData.email}</p>

      <h3>Products</h3>

      {userData.cart.products.map((product) => (
        <div
          key={product.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            padding: "10px",
            marginBottom: "10px",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          <img
            src={product.image}
            alt={product.productName}
            style={{
              width: "100px",
              height: "100px",
              objectFit: "contain",
              borderRadius: "6px",
            }}
          />
          <div>{product.productName}</div>
        </div>
      ))}

      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Delivery Address"
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <input
        type="text"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        placeholder="Phone Number"
        style={{ width: "100%", padding: "10px" }}
      />

      <button onClick={handleSubmit} style={{ marginTop: "20px" }}>
        Order Confirm
      </button>
    </div>
  );
};

export default CheckOut;
