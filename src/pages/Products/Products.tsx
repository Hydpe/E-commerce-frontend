import React, { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard/ProductCard";
import "./Products.css";
import axios from "axios";
import { Product } from "../../Data/Products";

interface ProductsProps
{
    page: string;
 }
const ProductsPage: React.FC<ProductsProps> = ({page}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  axios
    .get(`http://localhost:8080/ProductsData/GetCategory/${page}`)
    .then((res) => {
      const mappedProducts = res.data.map((p: any) => ({
        id: p.id,
        name: p.productName,
        price: p.price,
        image: p.image,
        description: p.description,
      }));
      setProducts(mappedProducts);
      setLoading(false);
    })
    .catch((err) => {
      console.error(err);
      setLoading(false);
    });
}, [page]);

  const handleAddToCart = async (product: Product) => {
    console.log("Added to cart:", product);
  };

  if (loading) return <h2>Loading products...</h2>;

  return (
    <div>
      <h1>Products</h1>
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
