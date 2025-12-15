const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
	{
		publicId: { type: String, required: true, trim: true },
		alt: { type: String, required: true, trim: true },
		productLabel: { type: String, required: true, trim: true },
		stars: { type: Number, required: true, min: 1, max: 5 },
		quote: { type: String, required: true, trim: true },
		author: { type: String, required: true, trim: true },
		ctaTo: { type: String, required: true, trim: true },
		ctaText: { type: String, trim: true, default: "" },

		// helps in future to easily change what to feature
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
