import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Products, Product } from "../../Data/Products";
import { Iproduct, User } from "../../Data/Interfaces";

interface PdpProps {
  IsLoggedIn: boolean;
  userProfile: User | null;
}

const Pdp: React.FC<PdpProps> = ({ IsLoggedIn, userProfile }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  if (!userProfile) return <div>Your cart is empty!</div>;

  const productId = Number(id);
  const product: Product | undefined = Products.find((p) => p.id === productId);

  if (!product) return <div>Product not found!</div>;

  const onAddToCart = async (product: Product) => {
    if (!IsLoggedIn) {
      navigate("/login", { state: { fromPdp: true, productId: product.id } });
      return;
    }

    let iproduct: Iproduct = {
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
      //  Session-based add to cart, no token
      const response = await axios.put(
        `http://localhost:8080/Cart/${product.id}`,
        {
       /*    id: product.id,
          productName: product.name,
          price: product.price,
          image: product.image,
          description: product.description, */
        },
        { withCredentials: true } //  send session cookie
      );

      alert("Product added to cart!");
      userProfile.cart?.products.push(iproduct);
    } catch (error) {
         console.log("passed Product id ",product.id);
      console.error("Error adding product to cart:", error);
      alert("Failed to add product to cart.");
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center", paddingBottom: "200px" }}>
      <h1>Product Description Page</h1>
      <img
        src={product.image}
        alt={product.name}
        style={{ width: "300px", height: "300px", objectFit: "contain" }}
      />
      <h3>{product.name}</h3>
      <p className="price"> ₹{product.price}</p>
      <p className="paragraph">{product.description}</p>
      <button onClick={() => onAddToCart(product)}>Add To Cart</button>
    </div>
  );
};

export default Pdp;
