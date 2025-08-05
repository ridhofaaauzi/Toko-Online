import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
import "./productlist.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        setProducts(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

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
