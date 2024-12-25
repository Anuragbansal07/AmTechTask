import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; 

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/profile", {
          withCredentials: true, 
        });

        setUser(response.data);
      } catch (error) {
        alert("Session expired or unauthorized. Please log in again.");
        localStorage.removeItem("authToken");
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  return user ? (
    <div>
      <h1>Welcome, {user.username}</h1>
      <p>Email: {user.email}</p>
      <p>Account Created: {new Date(user.created_at).toLocaleString()}</p>
      <button onClick={() => {
        localStorage.removeItem("authToken");
        document.cookie = "token=; Max-Age=0";
        navigate("/login");
      }}>
        Logout
      </button>
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default Profile;
