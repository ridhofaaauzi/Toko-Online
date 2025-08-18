import { useState } from "react";
import api from "../../utils/api";
import useCountdown from "../UseCountdown";

const useResetPassword = (token, navigate) => {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { countdown, disabled, startCountdown } = useCountdown();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const { data } = await api.post(`/auth/reset-password/${token}`, {
        password,
      });
      setMessage(data.message);

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      if (err.response) {
        if (err.response.status === 429) {
          const retryAfter =
            parseInt(err.response.headers["retry-after"], 10) || 60;
          startCountdown(retryAfter);
          setError(`Too many attempts. Try again in ${retryAfter} seconds.`);
        } else {
          setError(err.response.data?.message || "Request failed");
        }
      } else {
        setError("No response from the server");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    password,
    setPassword,
    message,
    error,
    isSubmitting,
    disabled,
    countdown,
    handleSubmit,
  };
};

export default useResetPassword;
