import { useLocation, useNavigate } from "react-router-dom";
import { User } from "../../Data/Interfaces";
import "./Order.css";

const Order: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const stateData = location.state as { userProfile?: User };
  const user = stateData?.userProfile;

  if (!user || !user.orders || user.orders.length === 0) {
    return (
      <div className="order-error">
        <h2> No Order Data Found</h2>
        <p>Your order information is not available.</p>
        <button onClick={() => navigate("/")}>Go to Home</button>
      </div>
    );
  }

  const latestOrder = user.orders[user.orders.length - 1];

  const orderTotal = latestOrder.products.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0
  );

  return (
    <div className="order-container">
      {/* Success Header */}
      <div className="success-header">
        <div className="success-icon">✓</div>
        <h1>Order Placed Successfully!</h1>
        <p className="order-subtitle">
          Thank you for your purchase. Your order has been confirmed.
        </p>
      </div>

      {/* Customer Info */}
      <div className="order-section">
        <h2>Customer Information</h2>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Name</span>
            <span className="info-value">{user.name}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Email</span>
            <span className="info-value">{user.email}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Order ID</span>
            <span className="info-value">#{latestOrder.id}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Items</span>
            <span className="info-value">{latestOrder.products.length}</span>
          </div>
        </div>
      </div>

      {/* Order Products */}
      <div className="order-section">
        <h2>Ordered Products</h2>
        <div className="products-grid">
          {latestOrder.products.map((product) => (
            <div key={product.id} className="order-product">
              <img
                src={product.image}
                alt={product.productName}
                className="product-image"
              />
              <div className="product-details">
                <h3>{product.productName}</h3>
                <p className="product-quantity">Quantity: {product.quantity}</p>
                <p className="product-price">₹{product.price.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="order-summary">
        <div className="summary-row">
          <span>Subtotal</span>
          <span>₹{orderTotal.toLocaleString()}</span>
        </div>
        <div className="summary-row">
          <span>Shipping</span>
          <span>₹40</span>
        </div>
        <div className="summary-divider"></div>
        <div className="summary-row total">
          <span>Total Paid</span>
          <span>₹{(orderTotal + 40).toLocaleString()}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="order-actions">
        <button className="primary-btn" onClick={() => navigate("/")}>
          Continue Shopping
        </button>
        <button className="secondary-btn" onClick={() => navigate("/profile")}>
          View All Orders
        </button>
      </div>
    </div>
  );
};

export default Order;