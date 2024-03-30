const express = require("express");
const router = express.Router();
const { createReview,getAllReviews, ReviewByUser} = require("../controllers/reviewController");
const {isAuthenticated} = require('../middlewares/Auth.js')
router.post("/review/new", createReview);
router.get("/review", getAllReviews);
router.get("/review/:userId", ReviewByUser);

module.exports = router;
