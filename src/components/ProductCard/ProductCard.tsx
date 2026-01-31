import React from "react";
import "./ProductCard.css";
import { useNavigate } from "react-router-dom";
import { Product } from "../../Data/Products";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  isLoggedIn: boolean;
  isInCart: boolean; // tracks if product is in cart
  onViewCart: () => void;
  page: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  isLoggedIn,
  isInCart,
  onViewCart,
  page,
}) => {
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    onAddToCart(product);
  };

  return (
    <div className="product-card">
      <img
        src={product.image}
        alt={product.name}
        className="product-image"
        onClick={() => navigate(`/pdp/${page}/${product.id}`)}
      />

      <h3>{product.name}</h3>
      <p className="price">₹{product.price}</p>

      {isLoggedIn && (
        <button
          className={`add-cart-btn ${isInCart ? "added" : ""}`}
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      )}
    </div>
  );
};

export default ProductCard;
