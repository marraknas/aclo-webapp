const mongoose = require("mongoose");

// for product listing
const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
            trim: true,
            enum: ["Learning Tower", "Utensils", "Accessories"],
        },
        description: {
            type: String,
            required: true,
        },

        options: {
            // non-dynamic map
            color: {
                type: [String],
                default: undefined,
            },
            stabiliser: {
                // keep this field here for showing in UI
                type: [String],
                default: undefined,
            },
            variant: {
                type: [String],
                default: undefined,
            },
            ovenMitt: {
                type: [String],
                default: undefined,
            },
        },
        addOnProducts: [
            new mongoose.Schema(
                {
                    productId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Product",
                    },
                    options: { type: Map, of: String },
                    pricing: new mongoose.Schema(
                        {
                            discountType: {
                                type: String,
                                enum: ["none", "fixed"],
                                default: "none",
                            },
                            amount: { type: Number, default: 0 },
                        },
                        { _id: false }
                    ),
                },
                { _id: false }
            ),
        ],
        images: {
            type: [
                {
                    publicId: {
                        type: String,
                        required: true,
                    },
                    alt: {
                        type: String,
                        required: false,
                    },
                    _id: false,
                },
            ],
            validate: {
                validator: (arr) => Array.isArray(arr) && arr.length > 0,
                message: "At least one image is required",
            },
            required: true,
        },
        isListed: {
            // if true, product should be shown on store
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
            required: false,
        },
        metaDescription: {
            type: String,
            required: false,
        },
        metaKeywords: {
            type: String,
            required: false,
        },

        // These fields are only used for shipping cost calculation
        // If seller wants to list the actual weight & dimensions, put it in description.
        dimensions: {
            // this is for delivery in cm
            length: Number,
            width: Number,
            height: Number,
        },
        weight: {
            type: Number,
            min: 0,
        }, // this is for delivery in grams
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
