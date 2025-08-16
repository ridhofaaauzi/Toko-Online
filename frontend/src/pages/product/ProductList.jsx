import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
import "./productlist.css";
import Modal from "react-modal";

// Set root app untuk modal
Modal.setAppElement("#root");

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [qrCode, setQrCode] = useState("");

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/products");

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
    fetchProducts();
  }, []);

  const truncateText = (text, wordLimit) => {
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  const openModal = async (productId) => {
    setSelectedProductId(productId);
    setModalOpen(true);

    try {
      const response = await axios.get(
        `http://localhost:5000/api/products/${productId}/qrcode`
      );
      setQrCode(response.data.qrCode);
    } catch (err) {
      console.error("Failed to fetch QR Code", err);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProductId(null);
    setQrCode("");
  };

  return (
    <div className="product-list-container">
      <Navbar />
      <div className="product-list-content">
        {error && <div className="error-message">{error}</div>}
        {loading ? (
          <div className="loading">Loading products...</div>
        ) : (
          <div className="product-cards-container">
            {products.length > 0 ? (
              products.map((product) => (
                <div className="product-card" key={product.id}>
                  {product.image_url && (
                    <div className="product-image-container">
                      <img
                        src={`http://localhost:5000/public${product.image_url}`}
                        alt={product.name}
                        className="product-image"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/300x200?text=No+Image";
                        }}
                      />
                    </div>
                  )}
                  <div className="card-header">
                    <h3>{product.name}</h3>
                    <span className="product-price">
                      Rp {Number(product.price).toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="card-body">
                    <p className="product-description">
                      {truncateText(product.description, 25)}
                    </p>
                  </div>
                  <button
                    onClick={() => openModal(product.id)}
                    className="qr-button">
                    Show QR Code
                  </button>
                </div>
              ))
            ) : (
              <div className="no-products">No products available</div>
            )}
          </div>
        )}

        {modalOpen && (
          <Modal
            isOpen={modalOpen}
            onRequestClose={closeModal}
            contentLabel="QR Code"
            style={{
              content: {
                maxWidth: "300px",
                margin: "auto",
                textAlign: "center",
                padding: "20px",
              },
            }}>
            <h3>QR Code Produk</h3>
            {qrCode ? (
              <>
                <img
                  src={qrCode}
                  alt="QR Code"
                  style={{ width: "200px", marginBottom: "10px" }}
                />
                <a
                  href={qrCode}
                  download={`product-${selectedProductId}-qrcode.png`}>
                  Download QR Code
                </a>
              </>
            ) : (
              <p>Loading QR Code...</p>
            )}
            <button
              onClick={closeModal}
              style={{
                marginTop: "10px",
                padding: "5px 10px",
                cursor: "pointer",
              }}>
              Close
            </button>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default ProductList;
