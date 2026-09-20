const express = require("express");
const router = express.Router();

const { createReview, getItemReviews } = require("../controllers/reviewController");
const { protect } = require("../middleware/auth");
const { validate, reviewSchema } = require("../utils/validators");

router.post("/", protect, validate(reviewSchema), createReview);
router.get("/item/:itemId", getItemReviews);

module.exports = router;
