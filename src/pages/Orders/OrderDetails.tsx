import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./OrderDetails.css";

const OrderDetails = () => {
  const navigate = useNavigate();
  const { state: order }: any = useLocation();

  if (!order) {
    return (
      <div className="order-details-error">
        <h2> Order Not Found</h2>
        <p>The order information you're looking for is not available.</p>
        <button onClick={() => navigate("/profile")}>Back to Profile</button>
      </div>
    );
  }

  const orderTotal = order.products.reduce(
    (sum: number, p: any) => sum + p.price * p.quantity,
    0
  );

  return (
    <div className="order-details-container">
      {/* Header */}
      <div className="order-details-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back to Profile
        </button>
        <h1>Order Details</h1>
      </div>

      {/* Order Info */}
      <div className="order-info-card">
        <div className="order-id-badge">Order #{order.id}</div>
        <div className="order-meta">
          <div className="meta-item">
            <span className="meta-label">Total Items</span>
            <span className="meta-value">{order.products.length}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Order Total</span>
            <span className="meta-value order-total">₹{orderTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="products-section">
        <h2>Products in this Order</h2>
        <div className="order-products-grid">
          {order.products.map((p: any) => (
            <div key={p.id} className="order-product-card">
              <img src={p.image} alt={p.productName} />
              <div className="product-info">
                <h4>{p.productName}</h4>
                <p className="quantity">Quantity: {p.quantity}</p>
                <p className="price">₹{p.price.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;