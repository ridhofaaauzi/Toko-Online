import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const AuthForm = ({ isLogin = false }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const { data } = await api.post(endpoint, formData);

      localStorage.setItem("token", data.token);
      navigate("/profile");
    } catch (error) {
      console.error("Auth error:", error);
      setError(error.response?.data?.message || "Authentication failed");
    }
  };

  return (
    <div>
      <h2>{isLogin ? "Login" : "Register"}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div>
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
        )}
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">{isLogin ? "Login" : "Register"}</button>
      </form>
    </div>
  );
};

export default AuthForm;
