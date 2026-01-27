// src/pages/Products/Products.tsx
import React from "react";
import ProductCard from "../../components/ProductCard/ProductCard";
import "./Products.css";
import { Products, Product } from "../../Data/Products";
import  axios from "axios";


const ProductsPage: React.FC = () => {

  const handleAddToCart =async (product: Product) => {
    console.log("Added to cart:", product);


  };
  return (
    <div>
      <h1>Products</h1>
      <div className="products-grid">
        {Products.map((product: Product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart= { handleAddToCart }
          />
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
