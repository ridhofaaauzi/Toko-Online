import axios from "axios";

export const createProduct = async ({ name, price, description, image }) => {
  const token = localStorage.getItem("accessToken");
  let image_url = "";

  if (image) {
    const uploadForm = new FormData();
    uploadForm.append("image", image);

    const uploadRes = await axios.post(
      "http://localhost:5000/api/upload",
      uploadForm,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    image_url = uploadRes.data.imageUrl;
  }

  const productData = { name, price, description, image_url };

  await axios.post("http://localhost:5000/api/products", productData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

const token = () => localStorage.getItem("accessToken");
export const getProductById = async (id) => {
  const { data } = await axios.get(`http://localhost:5000/api/products/${id}`, {
    headers: { Authorization: `Bearer ${token()}` },
  });
  return data.product;
};

export const updateProduct = async (id, productData) => {
  await axios.put(`http://localhost:5000/api/products/${id}`, productData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token()}`,
    },
  });
};

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const { data } = await axios.post(
    "http://localhost:5000/api/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token()}`,
      },
    }
  );

  return data.imageUrl;
};

export const deleteProduct = async (id) => {
  const token = localStorage.getItem("accessToken");
  const { data } = await axios.delete(
    `http://localhost:5000/api/products/${id}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!data.success) {
    throw new Error(data.error || "Delete failed");
  }
};

export const getProductQRCode = async (id) => {
  const { data } = await axios.get(
    `http://localhost:5000/api/products/${id}/qrcode`,
    { headers: { Authorization: `Bearer ${token()}` } }
  );
  return data.qrCode;
};
