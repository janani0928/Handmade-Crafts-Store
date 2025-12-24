// server/controllers/productsController.js
const Product = require('../Models/Product');

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err); // <-- check console
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};


