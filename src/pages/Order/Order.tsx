import { useLocation, useNavigate } from "react-router-dom";
import { User } from "../../Data/Interfaces";

const Order: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const stateData = location.state as { userProfile?: User };
  const user = stateData?.userProfile;

  if (!user || !user.orders || user.orders.length === 0) return <div>No order data found</div>;

  const latestOrder = user.orders[user.orders.length - 1];

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Order Placed Successfully!</h1>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <h3>Ordered Products</h3>
      {latestOrder.products.map((product) => (
        <div
          key={product.id}
          style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px", borderRadius: "6px" }}
        >
          <img src={product.image} alt={product.productName} style={{ width: "80px" }} />
          <div>{product.productName}</div>
          <div>₹ {product.price}</div>
        </div>
      ))}
      <button onClick={() => navigate("/")}>Go to Home</button>
    </div>
  );
};

export default Order;
