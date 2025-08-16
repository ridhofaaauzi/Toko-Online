import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../utils/api";
import "./AuthForm.css";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { handleError } from "../../utils/handleError";

const AuthForm = ({ isLogin = false }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    general: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    } else {
      setDisabled(false);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const validateForm = () => {
    const newErrors = { username: "", email: "", password: "", general: "" };
    let isValid = true;

    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    if (!isLogin) {
      if (!formData.username) {
        newErrors.username = "Username is required";
        isValid = false;
      } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
        newErrors.username = "Only letters, numbers and underscores allowed";
        isValid = false;
      } else if (formData.username.length < 3) {
        newErrors.username = "Username must be at least 3 characters";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name] || errors.general) {
      setErrors((prev) => ({ ...prev, [name]: "", general: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const { data } = await api.post(endpoint, formData);

      if (data.accessToken && data.refreshToken) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        navigate("/profile", { replace: true });
      } else {
        setErrors((prev) => ({
          ...prev,
          general: "Login failed: accessToken or refreshToken missing",
        }));
      }
    } catch (error) {
      handleError(error, setErrors);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">{isLogin ? "Login" : "Register"}</h2>

        {errors.general && <div className="auth-error">{errors.general}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={errors.username ? "input-error" : ""}
                placeholder="Input Username"
              />
              {errors.username && <span>{errors.username}</span>}
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "input-error" : ""}
              placeholder="Input Email"
            />
            {errors.email && <span>{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "input-error" : ""}
              placeholder="Input Password"
            />
            {errors.password && <span>{errors.password}</span>}
          </div>

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
              onSuccess={async (response) => {
                try {
                  const { data } = await axios.post(
                    "http://localhost:5000/api/auth/google",
                    { token: response.credential },
                    { withCredentials: true }
                  );
                  localStorage.setItem("accessToken", data.accessToken);
                  navigate("/profile");
                } catch (error) {
                  console.error("Google login failed:", error);
                }
              }}
              onError={() => console.log("Login Failed")}
            />
          )}
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
