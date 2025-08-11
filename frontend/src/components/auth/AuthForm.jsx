import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../utils/api";
import "./AuthForm.css";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

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
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {
      username: "",
      email: "",
      password: "",
      general: "",
    };

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
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name] || errors.general) {
      setErrors({
        ...errors,
        [name]: "",
        general: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";

      const { data } = await api.post(endpoint, formData);

      localStorage.setItem("token", data.token);
      navigate("/profile");
    } catch (error) {
      console.error("AUTH ERROR DETAILS:", {
        message: error.message,
        response: error.response,
        config: error.config,
        stack: error.stack,
      });

      if (error.response) {
        if (error.response.status === 500) {
          setErrors({
            ...errors,
            general:
              "Server error. Please check the console for details and try again later.",
          });
        } else if (error.response.data?.errors) {
          setErrors({
            ...errors,
            ...error.response.data.errors,
            general: error.response.data.message,
          });
        } else {
          setErrors({
            ...errors,
            general:
              error.response.data?.message ||
              `Registration failed (Status: ${error.response.status})`,
          });
        }
      } else if (error.request) {
        setErrors({
          ...errors,
          general: "No response from server. Check your network connection.",
        });
      } else {
        setErrors({
          ...errors,
          general: error.message || "An unexpected error occurred",
        });
      }
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
              <label className="form-label">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`form-input ${errors.username ? "input-error" : ""}`}
                placeholder="Input Username"
              />
              {errors.username && (
                <span className="error-message">{errors.username}</span>
              )}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? "input-error" : ""}`}
              placeholder="Input Email"
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-input ${errors.password ? "input-error" : ""}`}
              placeholder="Input Password"
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <div className="auth-switch">
            {isLogin ? (
              <p>
                Don't have an account?{" "}
                <Link to="/register" className="auth-link">
                  Register
                </Link>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <Link to="/login" className="auth-link">
                  Login
                </Link>
              </p>
            )}
          </div>

          <button type="submit" className="auth-button" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : isLogin ? "Login" : "Register"}
          </button>

          {isLogin && (
            <GoogleLogin
              onSuccess={async (response) => {
                try {
                  const credential = response.credential;
                  if (!credential) {
                    console.error("Credential kosong!");
                    return;
                  }

                  const { data } = await axios.post(
                    "http://localhost:5000/api/auth/google",
                    { credential }
                  );

                  localStorage.setItem("token", data.token);

                  navigate("/profile");
                } catch (error) {
                  console.error("Google login failed:", error);
                }
              }}
              onError={() => {
                console.log("Login Failed");
              }}
            />
          )}
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
