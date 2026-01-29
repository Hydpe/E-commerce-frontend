import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Product } from "../../Data/Products";
import { Iproduct, User } from "../../Data/Interfaces";

interface PdpProps {
  IsLoggedIn: boolean;
  userProfile: User | null;
}

const Pdp: React.FC<PdpProps> = ({ IsLoggedIn, userProfile }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8080/ProductsData/GetCategory/laptops")
      .then((res) => {
        const mappedProducts: Product[] = res.data.map((p: any) => ({
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
  }, []);


  if (loading) return <div>Loading...</div>;
  if (!userProfile) return <div>Your cart is empty!</div>;

  const productId = Number(id);
  const product = products.find((p) => p.id === productId);

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
      await axios.put(
        `http://localhost:8080/Cart/${product.id}`,
        {},
        { withCredentials: true }
      );

      alert("Product added to cart!");
      userProfile.cart?.products.push(iproduct);
    } catch (error) {
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
      <p className="price">₹{product.price}</p>
      <p className="paragraph">{product.description}</p>
      <button onClick={() => onAddToCart(product)}>Add To Cart</button>
    </div>
  );
};

export default Pdp;
