import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import "./ResetPassword.css";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const { data } = await api.post(`/auth/reset-password/${token}`, {
        password,
      });
      setMessage(data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Request gagal");
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-card">
        <h2 className="reset-title">Reset Password</h2>
        {message && <div className="alert success">{message}</div>}
        {error && <div className="alert error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            required
          />
          <button type="submit" className="auth-button">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
