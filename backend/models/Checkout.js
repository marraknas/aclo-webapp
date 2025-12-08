const mongoose = require("mongoose");

const checkoutItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    options: {
        type: Object,
        default: {},
    },
    quantity: {
        type: Number,
        required: true
    }
}, {_id: false});

const checkoutSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    checkoutItems: [checkoutItemSchema],
    shippingDetails: {
        name: {type: String, required: true},
        address: {type: String, required: true},
        city: {type: String, required: true},
        postalCode: {type: String, required: true},
        phone: {type: String, required: true} 
    },
    paymentMethod: { // might remove if not needed
        type: String,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paidAt: { // timestamp when payment was made
        type: Date,
        required: false,
    },
    paymentStatus: {
        type: String,
        default: "pending"
    },
    paymentDetails: {
        type: mongoose.Schema.Types.Mixed, // stores payment related details (transactionID, response from payment gateway)
        required: false,
    },
    isFinalized: {
        type: Boolean,
        default: false,
    },
    finalizedAt: { // timestamp when checkout was finalized
        type: Date,
        required: false
    }
}, {timestamps: true});

module.exports = mongoose.model("Checkout", checkoutSchema);
