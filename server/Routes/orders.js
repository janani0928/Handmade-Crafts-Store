const express = require("express");
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  cancelOrder,
} = require("../controllers/OrdersController");
const auth = require("../middleware/authMiddleware");

router.post("/", auth, createOrder);
router.get("/my-orders", auth, getMyOrders);
router.put("/cancel/:id", auth, cancelOrder);

module.exports = router;
