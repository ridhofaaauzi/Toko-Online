import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/sidebar/Sidebar";
import useProducts from "../../../hooks/product/UseProducts";
import {
  deleteProduct,
  getProductQRCode,
} from "../../../services/ProductService";
import ProductTableRow from "./components/ProductTableRow";
import QRCodeModal from "./components/QRCodeModa";
import "./productmanage.css";

const ProductManage = () => {
  const { products, loading, error, fetchProducts } = useProducts();
  const navigate = useNavigate();

  const [qrCode, setQrCode] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product and its image permanently?"))
      return;

    try {
      await deleteProduct(id);
      alert("Product deleted successfully");
      fetchProducts();
    } catch (err) {
      console.error("Delete error:", err);
      alert(err.message || "Delete failed");
    }
  };

  const handleShowQRCode = async (id) => {
    try {
      const qr = await getProductQRCode(id);
      setQrCode(qr);
      setShowModal(true);
    } catch (err) {
      console.error("Failed to get QRCode:", err);
      alert("Failed to load QR Code");
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
                    <ProductTableRow
                      key={product.id}
                      index={index}
                      product={product}
                      onDelete={handleDelete}
                      onShowQRCode={handleShowQRCode}
                      onEdit={() =>
                        navigate(`/dashboard/product/edit/${product.id}`)
                      }
                    />
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

      <QRCodeModal
        show={showModal}
        qrCode={qrCode}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default ProductManage;
