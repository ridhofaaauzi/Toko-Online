import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import "./ProductQRCodeModal.css";

Modal.setAppElement("#root");

const ProductQRCodeModal = ({ productId, isOpen, onClose }) => {
  const [qrCode, setQrCode] = useState("");

  useEffect(() => {
    if (!isOpen) return;

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
  }, [productId, isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="QR Code"
      overlayClassName="ReactModal__Overlay"
      className="qr-modal-content">
      <h3>QR Code Produk</h3>
      {qrCode ? (
        <>
          <img src={qrCode} alt="QR Code" className="qr-code-image" />
          <a
            href={qrCode}
            download={`product-${productId}-qrcode.png`}
            className="qr-download-btn">
            Download QR Code
          </a>
        </>
      ) : (
        <p className="qr-loading">Loading QR Code...</p>
      )}
      <button onClick={onClose} className="qr-close-btn">
        Close
      </button>
    </Modal>
  );
};

export default ProductQRCodeModal;
