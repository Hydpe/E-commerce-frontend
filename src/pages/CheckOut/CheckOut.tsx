import { useNavigate, useLocation } from "react-router-dom";
import { User } from "../../Data/Interfaces";
import { useState } from "react";
import axios from "axios";
import "./CheckOut.css";

interface CheckOutProps {
  userProfile: User | null;
  setUserProfile: (user: User) => void;
}

const CheckOut: React.FC<CheckOutProps> = ({ userProfile, setUserProfile }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "COD">("UPI");
  const [upiId, setUpiId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<{
    address?: string;
    phone?: string;
    upiId?: string;
  }>({});

  const stateData = location.state as { userProfile?: User };
  const userData = stateData?.userProfile || userProfile;

  if (!userData || !userData.cart || userData.cart.products.length === 0) {
    return (
      <div className="checkout-error">
        <h2> No Checkout Data Available</h2>
        <p>Your cart is empty or session has expired.</p>
        <button onClick={() => navigate("/")}>Go to Home</button>
      </div>
    );
  }

  const subtotal = userData.cart.products.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0
  );

  const shippingCharge = 40;
  const totalAmount = subtotal + shippingCharge;

  const validateForm = (): boolean => {
    const errors: typeof fieldErrors = {};
    let isValid = true;

    if (!address.trim()) {
      errors.address = "Delivery address is required";
      isValid = false;
    }

    if (!phone.trim()) {
      errors.phone = "Phone number is required";
      isValid = false;
    } else if (phone.length < 10) {
      errors.phone = "Phone number must be at least 10 digits";
      isValid = false;
    }

    if (paymentMethod === "UPI" && !upiId.trim()) {
      errors.upiId = "UPI ID is required";
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async () => {
    setError("");

    if (!validateForm()) {
      setError("Please fill all required fields correctly");
      return;
    }

    setLoading(true);

    try {
      const fullPhone = `${countryCode}${phone}`;

      const response = await axios.put(
        "http://localhost:8080/Users/order",
        null,
        {
          params: {
            address,
            phone: fullPhone,
            paymentMethod,
            upiId: paymentMethod === "UPI" ? upiId : "",
          },
          withCredentials: true,
        }
      );

      const updatedUser: User = response.data;
      setUserProfile(updatedUser);

      navigate("/order", { state: { userProfile: updatedUser } });
    } catch (err: any) {
      console.error("Order Failed:", err);

      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
        setTimeout(() => navigate("/login"), 2000);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Failed to place order. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      {/* Error Banner */}
      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={() => setError("")}>×</button>
        </div>
      )}

      <div className="checkout-content">
        {/* Left Column - Details */}
        <div className="checkout-details">
          <h1>Checkout</h1>

          {/* Customer Details */}
          <section className="checkout-section">
            <h2>Customer Details</h2>
            <div className="info-row">
              <span className="label">Name:</span>
              <span className="value">{userData.name}</span>
            </div>
            <div className="info-row">
              <span className="label">Email:</span>
              <span className="value">{userData.email}</span>
            </div>
          </section>

          {/* Delivery Address */}
          <section className="checkout-section">
            <h2>Delivery Address</h2>
            <div className="form-group">
              <input
                type="text"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  setFieldErrors({ ...fieldErrors, address: undefined });
                }}
                placeholder="Enter full delivery address"
                className={fieldErrors.address ? "error" : ""}
              />
              {fieldErrors.address && (
                <span className="field-error">{fieldErrors.address}</span>
              )}
            </div>
          </section>

          {/* Phone Number */}
          <section className="checkout-section">
            <h2>Contact Number</h2>
            <div className="phone-input-group">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="country-code"
              >
                <option value="+91">+91 (India)</option>
                <option value="+1">+1 (US)</option>
                <option value="+44">+44 (UK)</option>
                <option value="+61">+61 (Australia)</option>
              </select>

              <div className="form-group flex-1">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value.replace(/\D/g, ""));
                    setFieldErrors({ ...fieldErrors, phone: undefined });
                  }}
                  placeholder="Phone Number"
                  className={fieldErrors.phone ? "error" : ""}
                  maxLength={15}
                />
                {fieldErrors.phone && (
                  <span className="field-error">{fieldErrors.phone}</span>
                )}
              </div>
            </div>
          </section>

          {/* Payment Method */}
          <section className="checkout-section">
            <h2>Payment Method</h2>
            <div className="payment-options">
              <label className={`payment-option ${paymentMethod === "UPI" ? "active" : ""}`}>
                <input
                  type="radio"
                  value="UPI"
                  checked={paymentMethod === "UPI"}
                  onChange={() => setPaymentMethod("UPI")}
                />
                <div className="payment-info">
                  <span className="payment-icon"></span>
                  <span className="payment-label">UPI Payment</span>
                </div>
              </label>

              <label className={`payment-option ${paymentMethod === "COD" ? "active" : ""}`}>
                <input
                  type="radio"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                />
                <div className="payment-info">
                  <span className="payment-icon"></span>
                  <span className="payment-label">Cash on Delivery</span>
                </div>
              </label>
            </div>

            {paymentMethod === "UPI" && (
              <div className="form-group upi-input">
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => {
                    setUpiId(e.target.value);
                    setFieldErrors({ ...fieldErrors, upiId: undefined });
                  }}
                  placeholder="Enter UPI ID (example@upi)"
                  className={fieldErrors.upiId ? "error" : ""}
                />
                {fieldErrors.upiId && (
                  <span className="field-error">{fieldErrors.upiId}</span>
                )}
              </div>
            )}
          </section>
        </div>

        {/* Right Column - Summary */}
        <div className="checkout-summary">
          <h2>Order Summary</h2>

          {/* Products */}
          <div className="summary-products">
            {userData.cart.products.map((product) => (
              <div key={product.id} className="summary-product">
                <img src={product.image} alt={product.productName} />
                <div className="product-info">
                  <div className="product-name">{product.productName}</div>
                  <div className="product-meta">
                    Qty: {product.quantity} × ₹{product.price.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Price Details */}
          <div className="price-details">
            <div className="price-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="price-row">
              <span>Shipping</span>
              <span>₹{shippingCharge}</span>
            </div>
            <div className="divider"></div>
            <div className="price-row total">
              <span>Total Payable</span>
              <span>₹{totalAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Place Order Button */}
          <button
            className="place-order-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="btn-spinner"></div>
                Processing...
              </>
            ) : (
              <>
                Pay ₹{totalAmount.toLocaleString()} & Confirm Order
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;