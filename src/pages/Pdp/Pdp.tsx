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
  const { id, category } = useParams<{ id: string; category: string }>();

  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!category) return;

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
        }
      });
  }, [id, category]);

  if (!product) return <div>Loading...</div>;

  const onAddToCart = async () => {
    if (!IsLoggedIn) {
      navigate("/login", { state: { fromPdp: true, productId: product.id } });
      return;
    }

    await axios.put(
      `http://localhost:8080/Cart/${product.id}`,
      {},
      { withCredentials: true }
    );

    alert("Product added to cart!");
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>{product.name}</h1>
      <img src={product.image} width="300" />
      <p>₹{product.price}</p>
      <p>{product.description}</p>
      <button onClick={onAddToCart}>Add To Cart 🛒</button>
    </div>
  );
};

export default Pdp;
