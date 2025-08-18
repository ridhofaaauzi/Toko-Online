import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

const useProfileForm = () => {
  const [formData, setFormData] = useState({ username: "", email: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/auth/profile");
        const user = data?.user;
        if (user?.username && user?.email) {
          setFormData({ username: user.username, email: user.email });
        } else {
          throw new Error("Invalid user data structure");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile data");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitForm = async () => {
    try {
      const { data } = await api.put("/auth/profile", formData);
      if (data.success) {
        navigate("/profile", {
          state: { success: "Profile updated successfully!" },
        });
      } else {
        setError(data.message || "Update failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

  return {
    formData,
    handleChange,
    submitForm,
    error,
    success,
    setSuccess,
    navigate,
  };
};

export default useProfileForm;
