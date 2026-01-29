import React from "react";
import { User } from "../../Data/Interfaces";

interface ProfileProps {
  userProfile: User | null;
}

const Profile: React.FC<ProfileProps> = ({ userProfile }) => {
  if (!userProfile)
    return (
      <h2 style={{ textAlign: "center", marginTop: "60px", color: "#666" }}>
        Please login to view your profile
      </h2>
    );

  const { id, name, email, phoneNumber, address, cart, orders } = userProfile;

  const validOrders = orders.filter(
    (order) => order.products && order.products.length > 0
  );

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "30px",
        background: "linear-gradient(135deg, #f8fafc, #ffffff)",
        borderRadius: "16px",
        boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      {/* HEADER */}
      <h1
        style={{
          textAlign: "center",
          marginBottom: "35px",
          fontSize: "32px",
          fontWeight: "700",
          color: "#0f172a",
        }}
      >
        My Profile
      </h1>

      {/* BASIC INFO */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        <InfoCard label="User ID" value={id} />
        <InfoCard label="Name" value={name} />
        <InfoCard label="Email" value={email} />
        <InfoCard label="Phone" value={phoneNumber || "Not added"} />
        <InfoCard label="Address" value={address || "Not added"} />
      </div>

      {/* CART */}
      <Section title="Cart">
        {!cart || cart.products.length === 0 ? (
          <EmptyText text="Your cart is empty" />
        ) : (
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
            {cart.products.map((p) => (
              <Card key={p.id}>
                <strong>{p.productName}</strong>
                <div style={{ marginTop: "6px", color: "#475569" }}>
                  Qty: {p.quantity}
                </div>
              </Card>
            ))}
          </div>
        )}
      </Section>

      {/* ORDERS */}
      <Section title="Orders">
        {validOrders.length === 0 ? (
          <EmptyText text="No completed orders yet" />
        ) : (
          validOrders.map((order) => {
            const total = order.products.reduce(
              (sum, p) => sum + p.price * p.quantity,
              0
            );

            return (
              <div
                key={order.id}
                style={{
                  background: "#ffffff",
                  borderRadius: "14px",
                  padding: "18px",
                  marginBottom: "20px",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                    fontWeight: 600,
                  }}
                >
                  <span>Order #{order.id}</span>
                  <span>₹{total}</span>
                </div>

                {order.products.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      padding: "6px 0",
                      color: "#475569",
                      borderBottom: "1px dashed #e5e7eb",
                    }}
                  >
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
  <div style={{ marginBottom: "40px" }}>
    <h2
      style={{
        marginBottom: "15px",
        fontSize: "22px",
        color: "#0f172a",
        borderLeft: "4px solid #38bdf8",
        paddingLeft: "10px",
      }}
    >
      {title}
    </h2>
    {children}
  </div>
);

const InfoCard = ({ label, value }: any) => (
  <div
    style={{
      background: "#ffffff",
      padding: "14px 16px",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    }}
  >
    <div style={{ fontSize: "13px", color: "#64748b" }}>{label}</div>
    <div style={{ fontWeight: 600, marginTop: "4px" }}>{value}</div>
  </div>
);

const Card = ({ children }: any) => (
  <div
    style={{
      background: "#ffffff",
      padding: "14px",
      borderRadius: "12px",
      minWidth: "220px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    }}
  >
    {children}
  </div>
);

const EmptyText = ({ text }: any) => (
  <p style={{ color: "#64748b", marginTop: "10px" }}>{text}</p>
);

export default Profile;
