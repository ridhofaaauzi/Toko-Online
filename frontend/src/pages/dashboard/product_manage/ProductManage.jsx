import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/sidebar/Sidebar";
import useProducts from "../../../hooks/product/UseProducts";
import { deleteProduct } from "../../../services/ProductService";
import "./productmanage.css";

const ProductManage = () => {
  const { products, loading, error, fetchProducts } = useProducts();
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this product and its image permanently?"
    );
    if (!confirmDelete) return;

    try {
      await deleteProduct(id);
      alert("Product deleted successfully");
      fetchProducts();
    } catch (err) {
      alert(err.message || "Delete failed");
      console.error("Delete error:", err);
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
                  <th>#</th>
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
