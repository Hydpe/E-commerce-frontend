// Import React and useState to manage component state
import React, { useState } from "react";
import axios from "axios";
import "./Login.css";
import { Cart, Iproduct ,Order,User} from "../../Data/Interfaces";
import { useNavigate,useLocation } from "react-router-dom";


interface LoginProps {
  setIsLoggedIn: (value: boolean) => void;
   setUserProfile: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ setIsLoggedIn, setUserProfile}) => {
     const navigate= useNavigate();
             const location=useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleLogin = async() => {

    if (email === "" || password === "") {
      alert("Pleese fill all The  fields");
      return;
    }
     try {
         const response = await axios.post("http://localhost:8080/Users/Login",{
           email,
           password,
         });
         const token = response.data;
         localStorage.setItem("token", token);
         console.log("JWT token:", token);
          const response2 = await axios.get<User>(`http://localhost:8080/Users/getProfile?token=${token}`);
          setUserProfile(response2.data)
         // console.log("response2.data",response2.data);
             setIsLoggedIn(true);

         localStorage.setItem("token", token);
       } catch (error) {
         console.error("Login failed:", error);
       }
    console.log("Email:", email);
    console.log("Password:", password);
   // setIsLoggedIn(true);
    if(location.state?.fromPdp){
        alert("called from pdp");
        console.log("id recieved from pdp",location.state.productId);
        navigate("/pdp/"+location.state.productId);
        }else
    {
        navigate("/");
     }

  };
  return (
    <div className="login-container">
      <h2>Login</h2>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>


      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>


      <button className="login-button" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
};

export default Login;
