const express = require("express");
const router = express.Router();
const { Register, Verify, Login, userProfile } = require("../controllers/userController");
const {isAuthenticated} = require('../middlewares/Auth.js')
router.post("/register", Register);
router.get("/verify:token", Verify);
router.post("/login", Login);
router.get("/profile",isAuthenticated, userProfile);
module.exports = router;
