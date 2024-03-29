const express = require("express");
const router = express.Router();
const {
  checkout,
  confirmOrder,
  getOrdersByUser,
} = require("../controllers/orderController");

router.post("/checkout", checkout);
router.get("/confirm-order/:orderId", confirmOrder);
router.get("/orders/:userId", getOrdersByUser);

module.exports = router;
