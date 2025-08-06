import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/auth/profile", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data?.user) {
          setUser(response.data.user);
        } else {
          throw new Error("Invalid user data structure");
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to load profile";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading)
    return (
      <div className="loading-container">
        <Navbar />
        <div className="loading-spinner"></div>
      </div>
    );

  if (error)
    return (
      <div className="error-container">
        <Navbar />
        <div className="error-message">{error}</div>
      </div>
    );

  if (!user)
    return (
      <div className="error-container">
        <Navbar />
        <div className="error-message">No user data found</div>
      </div>
    );

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <h2 className="profile-title">User Profile</h2>
            <div className="profile-avatar">
              {user.username?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>
          <div className="profile-details">
            <div className="detail-item">
              <span className="detail-label">Username:</span>
              <span className="detail-value">{user.username || "N/A"}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{user.email || "N/A"}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Member Since:</span>
              <span className="detail-value">
                {new Date(user.created_at).toLocaleDateString()}
              </span>
            </div>
            {user.name && (
              <div className="detail-item">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{user.name}</span>
              </div>
            )}
          </div>
          <Link to="/profile/edit" className="edit-profile-btn">
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
