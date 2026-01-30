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
  category: string; // MUST match prop passed from ProductsPage
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
  const [products, setProducts] = useState<ProductForm[]>([createEmptyProduct()]);
  const [loading, setLoading] = useState(false);

  const handleChange = (index: number, field: keyof ProductForm, value: string) => {
    const updated = [...products];
    updated[index] = { ...updated[index], [field]: field === "price" ? Number(value) : value };
    setProducts(updated);
  };

  const addAnotherProduct = () => setProducts([...products, createEmptyProduct()]);
  const removeProduct = (index: number) => {
    if (products.length === 1) return;
    setProducts(products.filter((_, i) => i !== index));
  };

  const submitProducts = async () => {
    try {
      setLoading(true);
      const payload = products.map((p) => ({
        productName: p.productName,
        price: p.price,
        image: p.image,
        description: p.description,
        category: { name: category },
      }));

      await axios.post("http://localhost:8080/ProductsData/AddProductsRepo", payload, {
        withCredentials: true,
      });

      alert("Products added successfully!");
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to add products");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Add Products ({category})</h2>

        {products.map((product, index) => (
          <div key={index} className="product-form">
            <input
              placeholder="Product Name"
              value={product.productName}
              onChange={(e) => handleChange(index, "productName", e.target.value)}
            />
            <input
              type="number"
              placeholder="Price"
              value={product.price}
              onChange={(e) => handleChange(index, "price", e.target.value)}
            />
            <input
              placeholder="Image URL"
              value={product.image}
              onChange={(e) => handleChange(index, "image", e.target.value)}
            />
            <textarea
              placeholder="Description"
              value={product.description}
              onChange={(e) => handleChange(index, "description", e.target.value)}
            />
            {products.length > 1 && (
              <button className="remove-btn" onClick={() => removeProduct(index)}>
                Remove
              </button>
            )}
          </div>
        ))}

        <div className="modal-actions">
          <button onClick={addAnotherProduct}>➕ Add Another</button>
          <button onClick={submitProducts} disabled={loading}>
            {loading ? "Saving..." : "Save Products"}
          </button>
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
