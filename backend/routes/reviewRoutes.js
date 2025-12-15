const express = require("express");
const Review = require("../models/Review");

const router = express.Router();

// @route GET /api/reviews
// @desc Get all reviews to display in landing page
// @access Public
router.get("/landing-featured", async (req, res) => {
	try {
		const reviews = await Review.find({ isActive: true });
		res.json(reviews);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
});

module.exports = router;
