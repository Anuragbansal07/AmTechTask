import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import "./../styles/Login.css";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRecaptchaChange = (value) => {
    setRecaptchaValue(value); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!recaptchaValue) {
      setMessage("Please complete the reCAPTCHA verification.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, recaptcha: recaptchaValue }),
        credentials: "include", 
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/profile");
      } else {
        setMessage(data.error || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setMessage("Server error. Please try again later.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Log in</h1>
        {message && <p className="error-message">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <ReCAPTCHA
              sitekey="6LcMYaUqAAAAAOVDM-TC1p0bxePp9uySFJBlzZcr"  
              onChange={handleRecaptchaChange}
            />
          </div>
          <button type="submit" className="login-button">
            Log in
          </button>
        </form>
        <p className="switch-screen">
          or, <span onClick={() => navigate("/")}>sign up</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
