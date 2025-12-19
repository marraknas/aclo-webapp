const mongoose = require("mongoose");

// for inventory management
const productVariantSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        sku: {
            type: String,
            required: true,
            unique: true,
        },
        price: { 
            type: Number, 
            required: true 
        },
        discountPrice: {
			type: Number,
			required: false,
		},
        countInStock: {
            type: Number,
            default: 0,
        },
        // flat, optional option fields
        color: {
            type: String,
            required: false
        },
        stabiliser: {
            type: String,
            required: false
        },
        variant: {
            type: String,
            required: false
        },
        material: {
            type: String,
            required: false
        },
        images: [
            {
                url: String,
                altText: String,
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("ProductVariant", productVariantSchema);