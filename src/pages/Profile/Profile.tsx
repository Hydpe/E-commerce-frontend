import React from "react";
import { User } from "../../Data/Interfaces";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

interface ProfileProps {
  userProfile: User | null;
}

const Profile: React.FC<ProfileProps> = ({ userProfile }) => {
  const navigate = useNavigate();

  if (!userProfile)
    return (
      <h2 className="empty-text" style={{ textAlign: "center", marginTop: "60px", color: "#666" }}>
        Please login to view your profile
      </h2>
    );

  const { id, name, email, phoneNumber, address, orders } = userProfile;

  const validOrders = orders.filter((order) => order.products && order.products.length > 0);

  return (
    <div className="profile-container">
      <h1>My Profile</h1>

      {/* BASIC INFO */}
      <div className="info-grid">
        <InfoCard label="User ID" value={id} />
        <InfoCard label="Name" value={name} />
        <InfoCard label="Email" value={email} />
        <InfoCard label="Phone" value={phoneNumber || "Not added"} />
        <InfoCard label="Address" value={address || "Not added"} />
      </div>

      {/* ORDERS */}
      <Section title="Orders">
        {validOrders.length === 0 ? (
          <EmptyText text="No completed orders yet" />
        ) : (
          validOrders.map((order) => {
            const total = order.products.reduce((sum, p) => sum + p.price * p.quantity, 0);

            return (
              <div
                key={order.id}
                className="order-card"
                onClick={() => navigate(`/orders/${order.id}`, { state: order })}
              >
                <div className="order-card-header">
                  <span>Order #{order.id}</span>
                  <span>₹{total}</span>
                </div>

                {order.products.map((p) => (
                  <div key={p.id} className="order-product">
                    {p.productName} × {p.quantity}
                  </div>
                ))}
              </div>
            );
          })
        )}
      </Section>
    </div>
  );
};


const Section = ({ title, children }: any) => (
  <div className="section">
    <h2>{title}</h2>
    {children}
  </div>
);

const InfoCard = ({ label, value }: any) => (
  <div className="info-card">
    <div className="label">{label}</div>
    <div className="value">{value}</div>
  </div>
);

const EmptyText = ({ text }: any) => <p className="empty-text">{text}</p>;

export default Profile;
