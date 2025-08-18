import React from "react";
import { useForgotPassword } from "../../../hooks/auth/UseForgotPassword";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const { email, setEmail, message, error, countdown, disabled, handleSubmit } =
    useForgotPassword();

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <h2 className="forgot-title">Forgot Password</h2>

        {message && <div className="alert success">{message}</div>}
        {error && <div className="alert error">{error}</div>}

        <form onSubmit={handleSubmit} className="forgot-form">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <button type="submit" className="auth-button" disabled={disabled}>
            {disabled ? `Wait ${countdown}s` : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
