import React from "react";
import { User } from "../../Data/Interfaces";

interface ProfileProps {
  userProfile: User | null;
}

const Profile: React.FC<ProfileProps> = ({ userProfile }) => {
  if (!userProfile) {
    return <h2 style={{ textAlign: "center" }}>Please login to view profile</h2>;
  }

  const { id, name, email, phoneNumber, address, cart, orders } = userProfile;

  return (
    <div style={{ maxWidth: "700px", margin: "30px auto" }}>
      <h1>My Profile</h1>

      {/* BASIC INFO */}
      <h3>Basic Info</h3>
      <p>ID: {id}</p>
      <p>Name: {name}</p>
      <p>Email: {email}</p>
      <p>Phone: {phoneNumber || "Not added"}</p>
      <p>Address: {address || "Not added"}</p>

      {/* CART */}
      <h3>Cart</h3>
      {!cart || cart.products.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        cart.products.map((p) => (
          <p key={p.id}>
            {p.productName} — Qty: {p.quantity}
          </p>
        ))
      )}

      {/* ORDERS */}
      <h3>Orders</h3>
      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} style={{ marginBottom: "10px" }}>
            <strong>Order #{order.id}</strong>

            {order.products.map((p) => (
              <p key={p.id} style={{ marginLeft: "10px" }}>
                {p.productName} — Qty: {p.quantity}
              </p>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default Profile;
