import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState(""); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setMessage("Registration successful! Now you can log in.");
        setFormData({ username: "", email: "", password: "" });
      } else {
        setMessage(data.error || "Registration failed.");
      }
    } catch (error) {
      setMessage("Error connecting to the server.");
    }
  };
  
  

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Register</h2>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <button onClick={handleRegister} className="btn-register">
          Register
        </button>
        <button onClick={handleLoginRedirect} className="btn-login">
          Login
        </button>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default Register;
