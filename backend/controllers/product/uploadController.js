exports.uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
};

exports.updateProduct = async (req, res) => {
  const productId = req.params.id;
  const { name, price } = req.body;

  try {
    const existingProduct = await Product.findByPk(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (req.file) {
      if (existingProduct.image) {
        deleteImageFile(existingProduct.image);
      }
      existingProduct.image = req.file.filename;
    }

    existingProduct.name = name;
    existingProduct.price = price;

    await existingProduct.save();

    res.json({ message: "Product updated", product: existingProduct });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Update failed" });
  }
};

exports.deleteImage = async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.image) {
      deleteImageFile(product.image);
    }

    await product.destroy();

    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Delete failed" });
  }
};
