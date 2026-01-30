import React, { useEffect, useState, useCallback } from "react";
import ProductCard from "../../components/ProductCard/ProductCard";
import "./Products.css";
import axios from "axios";
import { Product } from "../../Data/Products";
import { Iproduct, User } from "../../Data/Interfaces";
import AddProductModal from "../../components/AddProductModal/AddProductModal";
import { useNavigate } from "react-router-dom";

interface ProductsProps {
  page: string;
  isLoggedIn: boolean;
  userProfile: User | null;
  searchTerm?: string;
}

const ProductsPage: React.FC<ProductsProps> = ({
  page,
  isLoggedIn,
  userProfile,
  searchTerm,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [cartIds, setCartIds] = useState<Set<number>>(new Set());

  const navigate = useNavigate();

  const fetchProducts = useCallback(() => {
    setLoading(true);
    axios
      .get(`http://localhost:8080/ProductsData/GetCategory/${page}`)
      .then((res) => {
        const mapped = res.data.map((p: any) => ({
          id: p.id,
          name: p.productName,
          price: p.price,
          image: p.image,
          description: p.description,
        }));
        setProducts(mapped);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddToCart = async (product: Product) => {
    if (!userProfile || !userProfile.cart) return;

    const iproduct: Iproduct = {
      id: product.id,
      productName: product.name,
      quantity: 1,
      description: product.description,
      price: product.price,
      image: product.image,
      cart: userProfile.cart,
      order: null,
    };

    try {
      await axios.put(
        `http://localhost:8080/Cart/${product.id}`,
        {},
        { withCredentials: true }
      );

      // Add product to user's cart
      userProfile.cart.products.push(iproduct);


      setCartIds(prev => {
        const newSet = new Set(prev);
        newSet.add(product.id);
        return newSet;
      });

    } catch (err) {
      console.error("Add to cart failed:", err);
      alert("Failed to add product to cart");
    }
  };

  if (loading) return <h2>Loading products...</h2>;

  // FILTER PRODUCTS BASED ON SEARCH TERM
  const filteredProducts = searchTerm
    ? products.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>{page === "mobiles" ? "Mobiles 📱" : "Laptops 💻"}</h1>

        <button
          style={{ fontSize: "30px", padding: "0 20px" }}
          onClick={() => setShowModal(true)}
        >
          ➕
        </button>
      </div>

      <div className="products-grid">
        {filteredProducts.map((product) => (
          <div key={product.id} style={{ position: "relative" }}>
            <ProductCard
              product={product}
              onAddToCart={handleAddToCart}
              isLoggedIn={isLoggedIn}
              page={page}
              isInCart={cartIds.has(product.id)}
              onViewCart={() => navigate("/cart")}
            />
          </div>
        ))}
      </div>

      {showModal && (
        <AddProductModal
          category={page}
          onClose={() => setShowModal(false)}
          onSuccess={fetchProducts}
        />
      )}
    </div>
  );
};

export default ProductsPage;
