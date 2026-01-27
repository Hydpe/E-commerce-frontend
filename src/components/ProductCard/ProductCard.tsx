// src/components/ProductCard/ProductCard.tsx
import React from "react";
import "./ProductCard.css";
import { useNavigate } from "react-router-dom";
import{ Products, Product } from "../../Data/Products";


interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
    const navigate = useNavigate();

  return (
    <div className="product-card">

      <img src={product.image} alt={product.name} onClick={() => navigate("/pdp/" + product.id)}/>
      <h3 >{product.name}</h3 >

      <p className="price"> ₹{product.price}</p>
    </div>
  );
};

export default ProductCard;



// <button onClick={() => onAddToCart(product)}>
  //        Add to Cart
   //     </button>