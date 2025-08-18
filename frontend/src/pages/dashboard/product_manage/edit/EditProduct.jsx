import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../../../components/sidebar/Sidebar";
import {
  getProductById,
  updateProduct,
  uploadImage,
} from "../../../../services/ProductService";
import "./EditProduct.css";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image: null,
    existingImageUrl: "",
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await getProductById(id);
        setFormData({
          name: product.name || "",
          // Format price tanpa desimal jika tidak perlu
          price: product.price
            ? product.price.toString().replace(/\.\d{2}$/, "")
            : "",
          description: product.description || "",
          image: null,
          existingImageUrl: product.image_url || "",
        });
        setPreviewImage(
          product.image_url
            ? `http://localhost:5000/public${product.image_url}`
            : null
        );
      } catch (err) {
        console.error(err);
        setError("Failed to load product data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "price") {
      // Hanya mengizinkan angka, tanpa koma atau titik
      const numericValue = value.replace(/[^0-9]/g, "");
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({ ...prev, image: file, existingImageUrl: "" }));

    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      let updatedData = {
        name: formData.name,
        // Konversi ke number
        price: parseInt(formData.price, 10),
        description: formData.description,
      };

      if (formData.image) {
        const image_url = await uploadImage(formData.image);
        updatedData.image_url = image_url;
      }

      await updateProduct(id, updatedData);
      navigate("/dashboard/products");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="edit-product-wrapper">
        <Sidebar />
        <div className="edit-product-content">
          <div className="loading">Loading product data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-product-wrapper">
      <Sidebar />
      <div className="edit-product-content">
        <form className="product-form" onSubmit={handleSubmit}>
          <h2>Edit Product</h2>
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
              type="text" // Ubah dari number ke text untuk kontrol lebih baik
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              inputMode="numeric" // Untuk keyboard numerik di mobile
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
            {(previewImage || formData.existingImageUrl) && (
              <div className="image-preview">
                <img
                  src={
                    previewImage ||
                    `http://localhost:5000/public${formData.existingImageUrl}`
                  }
                  alt="Preview"
                  width={300}
                />
                <p className="image-notice">
                  {formData.image
                    ? "New image preview"
                    : "Current product image"}
                </p>
              </div>
            )}
          </label>

          <div className="form-actions">
            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Product"}
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

export default EditProduct;
