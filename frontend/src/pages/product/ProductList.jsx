import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
import "./productlist.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
                    <p className="product-description">{product.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-products">No products available</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
