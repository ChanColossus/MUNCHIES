const express = require("express");
const router = express.Router();
const { create,get,Review } = require("../controllers/munchiesreviewController");
const {isAuthenticated} = require('../middlewares/Auth.js')
router.post("/munchiesreview/new", create);
router.get("/munchiesreview", get);
router.get("/munchiesreview/:userId", Review);

module.exports = router;
