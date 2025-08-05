const Product = require("../../models/product");
const path = require("path");
const fs = require("fs");

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.getAll();
    res.status(200).json({
      success: true,
      message: "Get All Product successfully",
      product: products,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
  try {
    const { name, description, price, image_url } = req.body;

    // 1. Ambil data produk lama
    const existingProduct = await Product.getById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 2. Cek apakah ada image_url baru DAN image lama ada
    if (
      image_url &&
      existingProduct.image_url &&
      image_url !== existingProduct.image_url
    ) {
      const oldImagePath = path.join(
        __dirname,
        "../../public/",
        existingProduct.image_url
      );

      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
        console.log("Gambar lama dihapus:", oldImagePath);
      } else {
        console.log("Gambar lama tidak ditemukan:", oldImagePath);
      }
    }

    // 3. Update data produk
    const updated = await Product.update(req.params.id, {
      name,
      description,
      price,
      image_url,
    });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updated,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.getById(req.params.id);
    console.log("Product to delete:", product);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.image_url) {
      const imagePath = path.join(
        __dirname,
        "../../public/",
        product.image_url
      );
      console.log("Trying to delete image:", imagePath);

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
