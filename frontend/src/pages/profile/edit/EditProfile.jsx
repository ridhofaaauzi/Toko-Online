import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../../../components/navbar/Navbar";
import useProfileForm from "../../../hooks/profile/UseProfileForm";
import "./EditProfile.css";

const EditProfile = () => {
  const location = useLocation();
  const {
    formData,
    handleChange,
    submitForm,
    error,
    success,
    setSuccess,
    navigate,
  } = useProfileForm();

  useEffect(() => {
    if (location.state?.success) {
      setSuccess(location.state.success);
      setTimeout(() => setSuccess(""), 3000);
    }
  }, [location, setSuccess]);

  const onSubmit = (e) => {
    e.preventDefault();
    submitForm();
  };

  return (
    <>
      <Navbar />
      <div className="edit-profile-container">
        <h2>Edit Profile</h2>

        {success && <Message type="success" text={success} />}
        {error && <Message type="error" text={error} />}

        <form onSubmit={onSubmit}>
          <FormInput
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

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

const FormInput = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  ...rest
}) => (
  <div className="form-group">
    <label>{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      {...rest}
    />
  </div>
);

const Message = ({ type, text }) => (
  <div className={type === "success" ? "success-message" : "error-message"}>
    {text}
  </div>
);
