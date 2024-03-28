const express = require("express");
const router = express.Router();
const { checkout, confirmOrder } = require("../controllers/orderController");

router.post("/checkout", checkout);
router.get("/confirm-order/:orderId", confirmOrder);

module.exports = router;
