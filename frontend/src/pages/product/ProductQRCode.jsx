import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductQRCode = ({ productId }) => {
  const [qrCode, setQrCode] = useState("");

  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/products/${productId}/qrcode`
        );
        setQrCode(response.data.qrCode);
      } catch (err) {
        console.error("Failed to fetch QR Code", err);
      }
    };

    fetchQRCode();
  }, [productId]);
  return (
    <div className="qr-code-container">
      {qrCode ? (
        <>
          <img src={qrCode} alt="QR Code" className="product-qr" />
          <a href={qrCode} download={`product-${productId}-qrcode.png`}>
            Download QR Code
          </a>
        </>
      ) : (
        <p>Loading QR Code...</p>
      )}
    </div>
  );
};

export default ProductQRCode;
