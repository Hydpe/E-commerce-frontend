import React from "react";
import { User } from "../../Data/Interfaces";

interface ProfileProps {
  userProfile: User | null;
}

const Profile: React.FC<ProfileProps> = ({ userProfile }) => {
  if (!userProfile)
    return <h2 style={{ textAlign: "center", marginTop: "30px", color: "#444" }}>Please login to view profile</h2>;

  const { id, name, email, phoneNumber, address, cart, orders } = userProfile;

  return (
    <div style={{ maxWidth: "700px", margin: "30px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "6px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>My Profile</h1>

      <h3 style={{ borderBottom: "1px solid #ccc", paddingBottom: "5px" }}>Basic Info</h3>
      <p><strong>ID:</strong> {id}</p>
      <p><strong>Name:</strong> {name}</p>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>Phone:</strong> {phoneNumber || "Not added"}</p>
      <p><strong>Address:</strong> {address || "Not added"}</p>

      <hr style={{ margin: "20px 0" }} />

      <h3 style={{ borderBottom: "1px solid #ccc", paddingBottom: "5px" }}>Cart</h3>
      {!cart || cart.products.length === 0 ? (
        <p style={{ color: "#777" }}>Cart is empty</p>
      ) : (
        cart.products.map((p) => (
          <p key={p.id} style={{ marginLeft: "15px" }}>• {p.productName} — Qty: {p.quantity}</p>
        ))
      )}

      <hr style={{ margin: "20px 0" }} />

      <h3 style={{ borderBottom: "1px solid #ccc", paddingBottom: "5px" }}>Orders</h3>
      {orders.length === 0 ? (
        <p style={{ color: "#777" }}>No orders yet</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} style={{ marginBottom: "12px", padding: "10px", border: "1px solid #eee", borderRadius: "4px" }}>
             <strong>Order {order.id}</strong>
            {order.products.map((p) => (
              <p key={p.id} style={{ marginLeft: "15px", marginTop: "5px" }}>• {p.productName} — Qty: {p.quantity}</p>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default Profile;
