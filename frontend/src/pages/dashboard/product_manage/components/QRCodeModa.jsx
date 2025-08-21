import React from "react";

const QRCodeModal = ({ show, qrCode, onClose }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Product QR Code</h3>
        {qrCode ? (
          <div className="qrcode-container">
            <img src={qrCode} alt="Product QR Code" />
          </div>
        ) : (
          <p>Loading...</p>
        )}
        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default QRCodeModal;
