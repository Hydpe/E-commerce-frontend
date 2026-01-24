import React from "react";
import { useParams } from "react-router-dom";
import { Products, Product } from "../../Data/Products";
import { Cart, User, Iproduct } from "../../Data/Interfaces";

import { useNavigate } from "react-router-dom";
import axios from "axios";

interface LoginProps {
    IsLoggedIn: boolean;
    userProfile:User |  null;
}

const Pdp: React.FC<LoginProps> = ({ IsLoggedIn ,userProfile}) => {
    const navigate = useNavigate();

    const { id } = useParams<{ id: string }>();
     if (!userProfile ) {
                    return <div>Your cart is empty!</div>;
                  }
    console.log("id", id);
    const productId = Number(id);
    const product: Product | undefined = Products.find(p => p.id === productId);

    if (!product) {
        return <div>Product not found!</div>;
    }

    const onAddToCart = async (product: Product) => {
        if (!IsLoggedIn) {
            navigate("/login", {
                state: {
                    fromPdp: true,
                    productId: product.id,
                },
            });
            return;
        }

        let iproduct: Iproduct = {
            id: product.id,
            productName: product.name,
            quantity: 1,
            description: product.description,
            price: product.price,
            image: "",
            cart: userProfile.cart,
            order: null,
        };

           const token = localStorage.getItem("token");

      try {

          const response = await axios.put(
              `http://localhost:8080/Cart/${userProfile.id}?token=${token}`,
              {
                  id: product.id,
                  productName: product.name,
                  price: product.price,
                  image: product.image,
                  description: product.description,
              }
          );
          console.log("Added to cart:", response.data);
          alert("Product added to cart!");
            console.log(
                      "received added the product in to cart succesfully ",
                      iproduct.productName
                  );
                  userProfile.cart?.products.push(iproduct);
                 // alert("Added To cart successfully");
                  console.log("added to cart successfully");
      } catch (error) {
          console.error("Error adding product to cart:", error);
          alert("Failed to add product to cart.");
      }
    };

    return (
        <div style={{ padding: "20px", textAlign: "center" , paddingBottom: "200px"}}>
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
