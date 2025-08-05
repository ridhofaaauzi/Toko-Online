import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../utils/api";
import "./EditProfile.css";
import Navbar from "../../components/navbar/Navbar";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/auth/profile");
        const user = response.data?.user;
        if (user?.username && user?.email) {
          setFormData({
            username: user.username,
            email: user.email,
          });
        } else {
          throw new Error("Invalid user data structure");
        }
      } catch (err) {
        console.error("Failed to load profile data", err);
        setError("Failed to load profile data");
      }
    };

    if (location.state?.success) {
      setSuccess(location.state.success);
      setTimeout(() => setSuccess(""), 3000);
    }

    fetchProfile();
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put("/auth/profile", formData);
      if (data.success) {
        navigate("/profile", {
          state: { success: "Profile updated successfully!" },
        });
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Navbar />
      <div className="edit-profile-container">
        <h2>Edit Profile</h2>

        {success && <div className="success-message">{success}</div>}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="save-button">
              Save Changes
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate("/profile")}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditProfile;
