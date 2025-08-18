import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import useProfile from "../../hooks/profile/UseProfile";
import "./Profile.css";

const Profile = () => {
  const { user, loading, error } = useProfile();

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

  const { username, email, created_at, name } = user;

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <h2 className="profile-title">User Profile</h2>
            <div className="profile-avatar">
              {username?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>

          <div className="profile-details">
            <Detail label="Username" value={username} />
            <Detail label="Email" value={email} />
            <Detail
              label="Member Since"
              value={new Date(created_at).toLocaleDateString()}
            />
            {name && <Detail label="Name" value={name} />}
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

const Detail = ({ label, value }) => (
  <div className="detail-item">
    <span className="detail-label">{label}:</span>
    <span className="detail-value">{value || "N/A"}</span>
  </div>
);
