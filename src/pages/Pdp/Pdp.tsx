import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Product } from "../../Data/Products";
import { User } from "../../Data/Interfaces";
import "./Pdp.css";

interface PdpProps {
  IsLoggedIn: boolean;
  userProfile: User | null;
}

const Pdp: React.FC<PdpProps> = ({ IsLoggedIn, userProfile }) => {
  const navigate = useNavigate();
  const { id, category } = useParams<{ id: string; category: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [addingToCart, setAddingToCart] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

  useEffect(() => {
    if (!category) {
      setError("Invalid product category");
      setLoading(false);
      return;
    }

    setLoading(true);
    axios
      .get(`http://localhost:8080/ProductsData/GetCategory/${category}`)
      .then((res) => {
        const found = res.data.find((p: any) => p.id === Number(id));
        if (found) {
          setProduct({
            id: found.id,
            name: found.productName,
            price: found.price,
            image: found.image,
            description: found.description,
          });
        } else {
          setError("Product not found");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch product:", err);
        setError("Failed to load product. Please try again later.");
        setLoading(false);
      });
  }, [id, category]);

  const onAddToCart = async () => {
    if (!IsLoggedIn) {
      navigate("/login", { state: { fromPdp: true, productId: product?.id } });
      return;
    }

    if (!product) return;

    setAddingToCart(true);
    setError("");

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

      setSuccessMessage("Product added to cart!");
      setTimeout(() => {
        navigate("/cart");
      }, 1500);

    } catch (err: any) {
      console.error("Add to cart failed:", err);

      // Handle different error types
      if (err.response?.status === 401) {
        setError("Please login to add items to cart");
        setTimeout(() => {
          navigate("/login", { state: { fromPdp: true, productId: product.id } });
        }, 2000);
      } else if (err.response?.status === 404) {
        setError("Product not found");
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Failed to add product to cart. Please try again.");
      }
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="pdp-loading">
        <div className="spinner"></div>
        <h2>Loading product...</h2>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="pdp-error">
        <h2> Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="pdp-container">
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
          <span>✓ {successMessage}</span>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span onClick={() => navigate("/")}>Home</span>
        <span> / </span>
        <span onClick={() => navigate(`/${category}`)}>{category}</span>
        <span> / </span>
        <span className="active">{product.name}</span>
      </div>

      {/* Product Details */}
      <div className="pdp-content">
        <div className="pdp-image-section">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="pdp-details-section">
          <h1>{product.name}</h1>

          <div className="pdp-price">
            <span className="currency">₹</span>
            <span className="amount">{product.price.toLocaleString()}</span>
          </div>

          <div className="pdp-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          <div className="pdp-actions">
            <button
              className="add-to-cart-btn"
              onClick={onAddToCart}
              disabled={addingToCart}
            >
              {addingToCart ? (
                <>
                  <div className="btn-spinner"></div>
                  Adding...
                </>
              ) : (
                <>
                   Add To Cart
                </>
              )}
            </button>

            <button
              className="back-btn"
              onClick={() => navigate(-1)}
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pdp;