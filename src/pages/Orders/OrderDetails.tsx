import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderDetails = () => {
  const navigate = useNavigate();
  const { state: order }: any = useLocation();

  if (!order)
    return <h2 style={{ textAlign: "center" }}>Order not found</h2>;

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "30px",
      }}
    >
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: "20px",
          background: "#2563eb",
          color: "#fff",
          padding: "8px 14px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
        }}
      >
        ← Back to Profile
      </button>

      <h1 style={{ marginBottom: "25px" }}>
        Order #{order.id}
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
        {order.products.map((p: any) => (
          <div
            key={p.id}
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "14px",
              boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
            }}
          >
            <img
              src={p.image}
              alt={p.productName}
              style={{
                width: "100%",
                height: "140px",
                objectFit: "contain",
                marginBottom: "10px",
              }}
            />

            <h4 style={{ marginBottom: "6px" }}>
              {p.productName}
            </h4>

            <p style={{ color: "#64748b", fontSize: "14px" }}>
              Quantity: {p.quantity}
            </p>

            <p style={{ fontWeight: 600 }}>
              ₹{p.price}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderDetails;
