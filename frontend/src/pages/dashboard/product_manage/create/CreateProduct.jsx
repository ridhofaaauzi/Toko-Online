import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../../components/sidebar/Sidebar";
import { createProduct } from "../../../../services/ProductService";
import "./createProduct.css";

const CreateProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({ ...prev, image: file }));

    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await createProduct(formData);
      navigate("/dashboard/products");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create product");
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
                <img src={previewImage} alt="Preview" width={300} />
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
