import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../../components/sidebar/Sidebar";
import "./EditProduct.css";

const EditProduct = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image: null,
    existingImageUrl: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/products/${id}`
        );
        const product = response.data.product; // ✅ perbaikan di sini

        const imageUrl = product.image_url
          ? `http://localhost:5000/public${product.image_url}`
          : "";

        setFormData({
          name: product.name || "",
          price:
            product.price % 1 === 0
              ? product.price.toString().replace(/\.0+$/, "")
              : product.price,
          description: product.description || "",
          image: null,
          existingImageUrl: product.image_url || "",
        });

        setPreviewImage(imageUrl);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const processedValue =
      name === "price" ? value.replace(/\.0+$/, "") : value;

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
        existingImageUrl: "", // Reset existing image jika upload baru
      }));

      // Preview gambar baru
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

    try {
      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
      };

      // Jika ada gambar baru
      if (formData.image) {
        const uploadFormData = new FormData();
        uploadFormData.append("image", formData.image);

        const uploadResponse = await axios.post(
          "http://localhost:5000/api/upload",
          uploadFormData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        productData.image_url = uploadResponse.data.imageUrl;
      }

      // Kirim permintaan update
      const response = await axios.put(
        `http://localhost:5000/api/products/${id}`,
        productData
      );

      if (response.data.success) {
        navigate("/dashboard/products");
      } else {
        throw new Error(response.data.error || "Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
      setError(err.response?.data?.error || err.message || "Update failed");
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
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              step="any"
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
                  style={{ maxWidth: "200px", marginTop: "10px" }}
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
