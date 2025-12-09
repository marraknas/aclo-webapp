const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		discountPrice: {
			type: Number,
			required: false,
		},
		countInStock: {
			type: Number,
			default: 0,
		},
		sku: {
			type: String,
			unique: true,
			required: true,
		},
		category: {
			type: String,
			enum: ["Learning Tower", "Stool", "Utensils", "Accessories"],
			required: true,
		},
		options: {
			type: Map,
			of: [String], // each key maps to an array of strings
			default: {},
		},
		material: {
			type: String,
			required: false,
		},
		images: [
			{
				url: {
					type: String,
					required: true,
				},
				altText: {
					type: String,
					required: false,
				},
			},
		],
		isFeatured: {
			type: Boolean,
			default: false,
		},
		isPublished: {
			type: Boolean,
			default: false,
		},
		rating: {
			type: Number,
			default: 0,
		},
		numReviews: {
			type: Number,
			default: 0,
		},
		user: {
			// the admin user that created the product
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		metaTitle: {
			type: String,
		},
		metaDescription: {
			type: String,
		},
		metaKeywords: {
			type: String,
		},
		dimensions: {
			// this is for delivery in cm
			length: Number,
			width: Number,
			height: Number,
		},
		weight: Number, // this is for delivery in grams
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
