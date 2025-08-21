import React from "react";

const ProductTableRow = ({
  index,
  product,
  onDelete,
  onShowQRCode,
  onEdit,
}) => {
  return (
    <tr>
      <td>{index + 1}</td>
      <td>{product.name}</td>
      <td>Rp {Number(product.price).toLocaleString()}</td>
      <td className="description-cell">{product.description}</td>
      <td>
        {product.image_url ? (
          <img
            src={`http://localhost:5000/public${product.image_url}`}
            alt={product.name}
            className="product-thumbnail"
          />
        ) : (
          <div className="no-image">No Image</div>
        )}
      </td>
      <td>
        <button className="edit-btn" onClick={onEdit}>
          Edit
        </button>
        <button className="delete-btn" onClick={() => onDelete(product.id)}>
          Delete
        </button>
        <button className="qrcode-btn" onClick={() => onShowQRCode(product.id)}>
          QR Code
        </button>
      </td>
    </tr>
  );
};

export default ProductTableRow;
