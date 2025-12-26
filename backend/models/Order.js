const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
	{
		productId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Product",
			required: true,
		},
		productVariantId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "ProductVariant",
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		options: {
			type: Object,
			default: {},
		},
		quantity: {
			type: Number,
			required: true,
		},
		weight: {
			type: Number,
			default: 0,
		},
	},
	{ _id: false }
);

// NEED TO ADD SHIPPING METHOD
const orderSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		orderItems: [orderItemSchema],
		shippingDetails: {
			name: { type: String, required: true },
			address: { type: String, required: true },
			city: { type: String, required: true },
			postalCode: { type: String, required: true },
			phone: { type: String, required: true },
		},
		paymentMethod: {
			type: String,
			required: true,
		},
		totalPrice: {
			type: Number,
			required: true,
		},
		isPaid: {
			type: Boolean,
			default: false,
		},
		paidAt: {
			// timestamp when payment was made
			type: Date,
			required: false,
		},
		isDelivered: {
			type: Boolean,
			default: false,
		},
		deliveredAt: {
			type: Date,
			required: false,
		},
		paymentStatus: {
			type: String,
			default: "pending",
		},
		paymentDetails: {
			type: mongoose.Schema.Types.Mixed,
			required: false,
		},
		status: {
			// order status
			type: String,
			enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
			default: "Processing",
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
