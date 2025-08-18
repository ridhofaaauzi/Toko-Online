import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ResetPassword.css";
import useResetPassword from "../../../hooks/auth/UseResetPassword";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const {
    password,
    setPassword,
    message,
    error,
    isSubmitting,
    disabled,
    countdown,
    handleSubmit,
  } = useResetPassword(token, navigate);

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

          <button
            type="submit"
            className="auth-button"
            disabled={isSubmitting || disabled}>
            {isSubmitting
              ? "Processing..."
              : disabled
              ? `Wait ${countdown}s`
              : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
