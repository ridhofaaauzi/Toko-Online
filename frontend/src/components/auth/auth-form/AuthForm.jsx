import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAuthForm } from "../../../hooks/auth/UseAuthForm";
import InputField from "../../ui/InputField";
import "./AuthForm.css";
import { useGoogleAuth } from "../../../hooks/auth/UseGoogleAuth";

const AuthForm = ({ isLogin = false }) => {
  const {
    formData,
    errors,
    isSubmitting,
    disabled,
    countdown,
    handleChange,
    handleSubmit,
  } = useAuthForm(isLogin);

  const { handleGoogleSuccess, handleGoogleError } = useGoogleAuth();

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">{isLogin ? "Login" : "Register"}</h2>

        {errors.general && <div className="auth-error">{errors.general}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <InputField
              label="Username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              placeholder="Input Username"
            />
          )}

          <InputField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="Input Email"
          />

          <InputField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="Input Password"
          />

          <div className="auth-switch">
            {isLogin ? (
              <p>
                Don't have an account? <Link to="/register">Register</Link>
              </p>
            ) : (
              <p>
                Already have an account? <Link to="/login">Login</Link>
              </p>
            )}
          </div>

          {isLogin && (
            <div className="extra-links">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>
          )}

          <button
            className="auth-button"
            type="submit"
            disabled={isSubmitting || disabled}>
            {disabled
              ? `Wait ${countdown}s`
              : isSubmitting
              ? "Processing..."
              : isLogin
              ? "Login"
              : "Register"}
          </button>

          {isLogin && (
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />
          )}
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
