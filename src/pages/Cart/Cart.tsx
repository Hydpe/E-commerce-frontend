import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User } from "../../Data/Interfaces";

interface CartProps {
    userProfile: User | null;
}

const Cart: React.FC<CartProps> = ({ userProfile }) => {
    const navigate = useNavigate();

    if (!userProfile || !userProfile.cart || userProfile.cart.products.length === 0) {
        return <div>Your cart is empty!</div>;
    }

    const handleDelete = async (productId: number) => {
        try {
            await axios.delete(`http://localhost:8080/Cart/${productId}`, {
                withCredentials: true,
            });

            userProfile.cart!.products = userProfile.cart!.products.filter(
                (p) => p.id !== productId
            );
        } catch (error) {
            console.error("Error deleting product from cart:", error);
            alert("Failed to delete product.");
        }
    };

    const totalPrice = userProfile.cart.products.reduce(
        (sum, product) => sum + product.price * product.quantity,
        0
    );

    return (
        <div style={{ padding: "20px" }}>
            <button
                style={{
                    padding: "12px 20px",
                    backgroundColor: "#38bdf8",
                    color: "#0f172a",
                    fontSize: "16px",
                    fontWeight: 600,
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    marginBottom: "20px",
                }}
                onClick={() =>
                    navigate("/checkOut/" + userProfile.id, { state: { userProfile } })
                }
            >
                CheckOut
            </button>

            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "20px",
                }}
            >
                {userProfile.cart.products.map((product) => (
                    <div
                        key={product.id}
                        style={{
                            border: "1px solid #ccc",
                            padding: "10px",
                            borderRadius: "6px",
                            width: "200px",
                            textAlign: "center",
                        }}
                    >
                        <img
                            src={product.image}
                            alt={product.productName}
                            style={{
                                width: "100%",
                                height: "150px",
                                objectFit: "contain",
                                borderRadius: "6px",
                                marginBottom: "10px",
                            }}
                        />
                        <h3 style={{ fontSize: "16px", margin: "10px 0" }}>
                            {product.productName}
                        </h3>
                        <p style={{ fontWeight: "bold" }}>₹{product.price}</p>

                        <button
                            style={{
                                marginTop: "10px",
                                padding: "8px 12px",
                                backgroundColor: "#ef4444",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontWeight: 600,
                            }}
                            onClick={() => handleDelete(product.id)}
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>


            <div
                style={{
                    marginTop: "30px",
                    textAlign: "right",
                    fontSize: "18px",
                    fontWeight: "bold",
                }}
            >
                Total Price: ₹{totalPrice}
            </div>
        </div>
    );
};

export default Cart;
