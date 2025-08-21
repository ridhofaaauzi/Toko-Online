import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { handleError } from "../../utils/handleError";
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "../../utils/validators";
import useCountdown from "../UseCountdown";

export const useAuthForm = (isLogin) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { countdown, startCountdown, disabled } = useCountdown();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      ...(isLogin ? {} : { username: validateUsername(formData.username) }),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((err) => err === "");
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
        localStorage.setItem("username", data.user.username);
        navigate("/profile", { replace: true });
      } else {
        setErrors((prev) => ({
          ...prev,
          general: "Login failed: Token missing",
        }));
      }
    } catch (error) {
      handleError(error, setErrors);
      startCountdown(10);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    disabled,
    countdown,
    handleChange,
    handleSubmit,
  };
};
