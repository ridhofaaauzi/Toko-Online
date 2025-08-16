const Product = require("../../models/product");
const path = require("path");
const fs = require("fs");
const QRCode = require("qrcode");

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.getAll();

    res.status(200).json({
      success: true,
      message: "Get All Product successfully",
      product: products || [],
    });
  } catch (err) {
    console.error("Error in getProducts:", err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil produk.",
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.getById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({
      success: true,
      message: "Get Product successfully",
      product: product,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, image_url } = req.body;
    const newProduct = await Product.create({
      name,
      description,
      price,
      image_url,
    });
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;

  try {
    const product = await Product.getById(id);

    if (!product) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    const oldImage = product.image_url;

    let updatedData = {
      name,
      description,
      price,
    };

    if (req.body.image_url) {
      const newImage = req.body.image_url.replace("/public/", "");

      if (oldImage && oldImage !== newImage) {
        const oldImagePath = path.join(__dirname, "../../public", oldImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      updatedData.image_url = newImage;
    }

    await Product.update(id, updatedData);

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedData,
    });
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.getById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.image_url) {
      const imagePath = path.join(
        __dirname,
        "../../public/",
        product.image_url
      );

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log("Image deleted:", imagePath);
      } else {
        console.log("Image not found:", imagePath);
      }
    }

    await Product.delete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getProductQRCode = async (req, res) => {
  try {
    const product = await Product.getById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product Not Found",
      });
    }

    const productURL = `http://localhost:5173/products/${product.id}`;
    const qrCodeDataURL = await QRCode.toDataURL(productURL);

    res.status(200).json({
      success: 200,
      qrCode: qrCodeDataURL,
    });
  } catch (error) {
    console.error("QR Code generation error:", err);
    res.status(500).json({ message: "Failed to generate QR Code" });
  }
};
