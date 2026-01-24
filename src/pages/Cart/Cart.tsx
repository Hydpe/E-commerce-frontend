import { useNavigate } from "react-router-dom";
import { User } from "../../Data/Interfaces";

interface CartProps {
    userProfile: User |null; // non-nullable
}

const Cart: React.FC<CartProps> = ({ userProfile }) => {
    const navigate = useNavigate();
   if (!userProfile || !userProfile.cart || userProfile.cart.products.length === 0) {
      return <div>Your cart is empty!</div>;
    }

    return (
        <div>
            <style>
                {`
                  .product-card {
                    border: 1px solid black;
                    padding: 10px;
                    margin-bottom: 10px;
                  }
                  button {
                      width: 100%;
                      padding: 12px;
                      background-color: #38bdf8;
                      color: #0f172a;
                      font-size: 16px;
                      font-weight: 600;
                      border: none;
                      border-radius: 6px;
                      cursor: pointer;
                  }
                `}
            </style>
           <button onClick={() => navigate("/checkOut/" + userProfile.id,{ state: { userProfile }})}>
                           CheckOut
                       </button>
            {userProfile.cart.products.map(product => (
                <div key={product.id} className="product-card">
                    <h1>Product ID: {product.id}</h1>
                    <h3>{product.productName}</h3>
                    <p>Price: ${product.price}</p>
                </div>
            ))}
        </div>
    );
};

export default Cart;
