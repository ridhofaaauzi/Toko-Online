import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/sidebar/Sidebar";
import "./createProduct.css";

const CreateProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const token = localStorage.getItem("token");

    try {
      let image_url = "";

      if (formData.image) {
        const uploadFormData = new FormData();
        uploadFormData.append("image", formData.image);

        const uploadResponse = await axios.post(
          "http://localhost:5000/api/upload",
          uploadFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        image_url = uploadResponse.data.imageUrl;
      }

      const productData = {
        name: formData.name,
        price: formData.price,
        description: formData.description,
        image_url,
      };

      await axios.post("http://localhost:5000/api/products", productData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      navigate("/dashboard/products");
    } catch (err) {
      console.error("Error:", err);
      setError(err.response?.data?.error || "Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-product-wrapper">
      <Sidebar />
      <div className="create-product-content">
        <form className="product-form" onSubmit={handleSubmit}>
          <h2>Create New Product</h2>

          {error && <div className="error-message">{error}</div>}

          <label>
            Product Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Price
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
          </label>

          <label>
            Description
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
            />
          </label>

          <label>
            Product Image
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {previewImage && (
              <div className="image-preview">
                <img
                  src={previewImage}
                  alt="Preview"
                  style={{ maxWidth: "200px", marginTop: "10px" }}
                />
              </div>
            )}
          </label>

          <div className="form-actions">
            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Product"}
            </button>

            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate("/dashboard/products")}
              disabled={isSubmitting}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
