// server/controllers/ordersController.js
const Order = require("../Models/Order");
const Product = require("../Models/product");


exports.cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findOne({
      _id: orderId,
     user: req.user.userId

    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
if (["Shipped", "Delivered", "Cancelled"].includes(order.status)) {
  return res.status(400).json({ message: "Order cannot be Cancelled" });
}


    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: item.quantity },
      });
    }

    order.status = "Cancelled";
await order.save({ validateBeforeSave: false });

    res.status(200).json({ message: "Order cancelled successfully" });
  } catch (err) {
    console.error("Cancel order error:", err);
    res.status(500).json({ message: "Cancel failed" });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId })
      .sort({ createdAt: -1 });

    res.json(orders); // ✅ MUST be array
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};






/* ================= CREATE ORDER ================= */
exports.createOrder = async (req, res) => {
  try {
    const { items, address, totalAmount, paymentMethod, paymentStatus } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    const normalizedItems = items.map((item) => ({
      productId: item.productId || item._id,
      name: item.name || item.title,
      price: item.price,
      quantity: item.quantity || 1,
      images: item.images || [],
    }));

    const order = new Order({
      orderId: "ORD-" + Date.now(),
      user: req.user.userId,
      items: normalizedItems,
      address,
      totalAmount,
      paymentMethod,
      paymentStatus,
      status: "Placed",
    });

    await order.save();

    res.status(201).json(order);
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: err.message });
  }
};
