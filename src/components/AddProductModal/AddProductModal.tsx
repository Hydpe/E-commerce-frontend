import React, { useState } from "react";
import axios from "axios";
import "./AddProductModal.css";

interface ProductForm {
  productName: string;
  price: number;
  image: string;
  description: string;
}

interface AddProductModalProps {
  category: string;
  onClose: () => void;
  onSuccess: () => void;
}

const createEmptyProduct = (): ProductForm => ({
  productName: "",
  price: 0,
  image: "",
  description: "",
});

const AddProductModal: React.FC<AddProductModalProps> = ({
  category,
  onClose,
  onSuccess,
}) => {
  const [products, setProducts] = useState<ProductForm[]>([
    createEmptyProduct(),
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleChange = (
    index: number,
    field: keyof ProductForm,
    value: string
  ) => {
    const updated = [...products];
    updated[index] = {
      ...updated[index],
      [field]: field === "price" ? Number(value) : value,
    };
    setProducts(updated);
  };

  const addAnotherProduct = () => {
    setProducts([...products, createEmptyProduct()]);
  };

  const removeProduct = (index: number) => {
    if (products.length === 1) return;
    setProducts(products.filter((_, i) => i !== index));
  };

  const validateProducts = (): boolean => {
    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      if (!p.productName.trim()) {
        setError(`Product ${i + 1}: Name is required`);
        return false;
      }
      if (p.price <= 0) {
        setError(`Product ${i + 1}: Price must be greater than 0`);
        return false;
      }
      if (!p.image.trim()) {
        setError(`Product ${i + 1}: Image URL is required`);
        return false;
      }
      if (!p.description.trim()) {
        setError(`Product ${i + 1}: Description is required`);
        return false;
      }
    }
    return true;
  };

  const submitProducts = async () => {
    setError("");

    if (!validateProducts()) {
      return;
    }

    try {
      setLoading(true);
      const payload = products.map((p) => ({
        productName: p.productName,
        price: p.price,
        image: p.image,
        description: p.description,
        category: { name: category },
      }));

      await axios.post(
        "http://localhost:8080/ProductsData/AddProductsRepo",
        payload,
        {
          withCredentials: true,
        }
      );

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);

      if (err.response?.status === 401) {
        setError("Unauthorized. Please login first.");
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Failed to add products. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Products ({category})</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="modal-error-banner">
            <span>{error}</span>
          </div>
        )}

        {/* Products Forms */}
        <div className="products-forms">
          {products.map((product, index) => (
            <div key={index} className="product-form">
              <div className="form-header">
                <h3>Product {index + 1}</h3>
                {products.length > 1 && (
                  <button
                    className="remove-form-btn"
                    onClick={() => removeProduct(index)}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="form-grid">
                <input
                  placeholder="Product Name *"
                  value={product.productName}
                  onChange={(e) =>
                    handleChange(index, "productName", e.target.value)
                  }
                  className="form-input"
                />
                <input
                  type="number"
                  placeholder="Price *"
                  value={product.price || ""}
                  onChange={(e) => handleChange(index, "price", e.target.value)}
                  className="form-input"
                  min="0"
                />
                <input
                  placeholder="Image URL *"
                  value={product.image}
                  onChange={(e) => handleChange(index, "image", e.target.value)}
                  className="form-input full-width"
                />
                <textarea
                  placeholder="Description *"
                  value={product.description}
                  onChange={(e) =>
                    handleChange(index, "description", e.target.value)
                  }
                  className="form-textarea full-width"
                  rows={3}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Modal Actions */}
        <div className="modal-actions">
          <button className="add-another-btn" onClick={addAnotherProduct}>
             Add Another Product
          </button>
          <div className="action-buttons">
            <button
              className="save-btn"
              onClick={submitProducts}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="btn-spinner"></div>
                  Saving...
                </>
              ) : (
                `Save ${products.length} Product${products.length > 1 ? "s" : ""}`
              )}
            </button>
            <button className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;