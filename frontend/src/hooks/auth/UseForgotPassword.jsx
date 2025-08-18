import { useState } from "react";
import api from "../../utils/api";
import useCountdown from "../UseCountdown";

export const useForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { countdown, disabled, startCountdown } = useCountdown();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      setMessage(data.message);
    } catch (err) {
      if (err.response) {
        if (err.response.status === 429) {
          const retryAfter = parseInt(
            err.response.headers["retry-after"] || "60",
            10
          );
          startCountdown(retryAfter);
          setError(
            `Too many attempts. Please try again in ${retryAfter} seconds.`
          );
        } else {
          setError(err.response.data?.message || "Request failed");
        }
      } else {
        setError("No response from the server");
      }
    }
  };

  return {
    email,
    setEmail,
    message,
    error,
    countdown,
    disabled,
    handleSubmit,
  };
};
