const express = require("express");
const router = express.Router();
const { Register, Verify, Login } = require("../controllers/userController");

router.post("/register", Register);
router.get("/verify:token", Verify);
router.post("/login", Login);

module.exports = router;
