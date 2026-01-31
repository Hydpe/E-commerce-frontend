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
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const navigate = useNavigate();

  const fetchProducts = useCallback(() => {
    setLoading(true);
    setError("");

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
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products. Please try again later.");
        setLoading(false);
      });
  }, [page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddToCart = async (product: Product) => {
    if (!userProfile || !userProfile.cart) {
      setError("Please login to add items to cart");
      return;
    }

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
      const response = await axios.put(
        `http://localhost:8080/Cart/${product.id}`,
        {},
        { withCredentials: true }
      );

      // Check if response indicates an error
      if (response.data.error) {
        setError(response.data.error);
        return;
      }

      // Add product to user's cart
      userProfile.cart.products.push(iproduct);

      setCartIds((prev) => {
        const newSet = new Set(prev);
        newSet.add(product.id);
        return newSet;
      });

      setSuccessMessage(`${product.name} added to cart!`);
      setTimeout(() => setSuccessMessage(""), 3000);

    } catch (err: any) {
      console.error("Add to cart failed:", err);

      // Handle different error types
      if (err.response?.status === 401) {
        setError("Please login to add items to cart");
      } else if (err.response?.status === 404) {
        setError("Product not found");
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Failed to add product to cart. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <h2>Loading products...</h2>
      </div>
    );
  }

  // FILTER PRODUCTS BASED ON SEARCH TERM
  const filteredProducts = searchTerm
    ? products.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products;

  return (
    <div className="products-page">
      {/* Error Message */}
      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={() => setError("")}>×</button>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="success-banner">
          <span>{successMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="products-header">
        <h1>{page === "mobiles" ? "Mobiles " : "Laptops "}</h1>
        <button className="add-product-btn" onClick={() => setShowModal(true)}>
           Add Product
        </button>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="no-products">
          <p>No products found</p>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div key={product.id}>
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
      )}

      {/* Add Product Modal */}
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