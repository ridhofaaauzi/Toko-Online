import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/sidebar/Sidebar";
import "./productmanage.css";

const ProductManage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get("http://localhost:5000/api/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const productList = response.data.product;

      if (Array.isArray(productList)) {
        setProducts(productList);
        setError(null);
      } else {
        throw new Error("Invalid data format received");
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to load products. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product and its image permanently?")) {
      return;
    }
    const token = localStorage.getItem("token");

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        await getProducts();
        alert("Product deleted successfully");
      } else {
        throw new Error(response.data.error || "Delete failed");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert(err.response?.data?.error || err.message || "Delete failed");
    }
  };

  return (
    <div className="product-manage-wrapper">
      <Sidebar />
      <div className="product-manage-content">
        <div className="header">
          <h2>Product List</h2>
          <button
            className="create-btn"
            onClick={() => navigate("/dashboard/product/create")}>
            + Add Product
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading products...</div>
        ) : (
          <div className="table-container">
            <table className="product-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Description</th>
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((product, index) => (
                    <tr key={product.id}>
                      <td>{index + 1}</td>
                      <td>{product.name}</td>
                      <td>Rp {Number(product.price).toLocaleString()}</td>
                      <td className="description-cell">
                        {product.description}
                      </td>
                      <td>
                        {product.image_url ? (
                          <img
                            src={`http://localhost:5000/public${product.image_url}`}
                            alt={product.name}
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                              borderRadius: "4px",
                            }}
                          />
                        ) : (
                          <div className="no-image">No Image</div>
                        )}
                      </td>
                      <td>
                        <button
                          className="edit-btn"
                          onClick={() =>
                            navigate(`/dashboard/product/edit/${product.id}`)
                          }>
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(product.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-products">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManage;
