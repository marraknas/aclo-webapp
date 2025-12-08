const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Helper function to get a cart by userId or guestId
const getCart = async (userId, guestId) => {
	if (userId) {
		return await Cart.findOne({ user: userId });
	} else if (guestId) {
		return await Cart.findOne({ guestId });
	}
	return null;
};

// Helper function to check if a Cart products' map's contents are the same
const sameOptions = (a = {}, b = {}) => {
	const aKeys = Object.keys(a);
	const bKeys = Object.keys(b);
	if (aKeys.length !== bKeys.length) return false;

	return aKeys.every((key) => a[key] === b[key]);
};

// @route POST /api/cart
// @desc Add a product to the cart for a guest or logged in user
// @access Public
router.post("/", async (req, res) => {
	const { productId, quantity, options, guestId, userId } = req.body;
	try {
		const product = await Product.findById(productId);
		if (!product) return res.status(404).json({ message: "Product Not Found" });

		// Determine if user is logged in or guest
		let cart = await getCart(userId, guestId);

		// if the cart exists, update it
		if (cart) {
			const productIndex = cart.products.findIndex(
				(p) =>
					p.productId.toString() === productId &&
					sameOptions(p.options, options)
			);

			if (productIndex > -1) {
				// product alr exists, update the quantity
				cart.products[productIndex].quantity += quantity;
			} else {
				// add new product
				cart.products.push({
					productId,
					name: product.name,
					image: product.images[0].url,
					price: product.price,
					options,
					quantity,
				});
			}

			// Recalculate total price
			cart.totalPrice = cart.products.reduce(
				(acc, item) => acc + item.price * item.quantity,
				0
			);
			await cart.save();
			return res.status(200).json(cart);
		} else {
			// Create a new cart for the guest/user
			const newCart = await Cart.create({
				user: userId ? userId : undefined,
				guestId: guestId ? guestId : "guest_" + new Date().getTime(),
				products: [
					{
						productId,
						name: product.name,
						image: product.images[0].url,
						price: product.price,
						options,
						quantity,
					},
				],
				totalPrice: product.price * quantity,
			});
			return res.status(201).json(newCart);
		}
	} catch (error) {
		console.error(error);
		res.status(500).send("Server Error");
	}
});

// @route PUT /api/cart
// @desc Update product quantity in the cart for a guest/logged-in user
// @access Public
router.put("/", async (req, res) => {
	const { productId, quantity, options, guestId, userId } = req.body;
	try {
		let cart = await getCart(userId, guestId);
		if (!cart) return res.status(404).json({ message: "Cart Not Found" });

		const productIndex = cart.products.findIndex(
			(p) =>
				p.productId.toString() === productId && sameOptions(p.options, options)
		);
		if (productIndex > -1) {
			// update quantity
			if (quantity > 0) {
				cart.products[productIndex].quantity = quantity;
			} else {
				cart.products.splice(productIndex, 1); // remove product if quantity is 0
			}

			cart.totalPrice = cart.products.reduce(
				(acc, item) => acc + item.price * item.quantity,
				0
			);
			await cart.save();
			return res.status(200).json(cart);
		} else {
			return res.status(404).json({ message: "Product not found in cart" });
		}
	} catch (error) {
		console.error(error);
		res.status(500).send("Server Error");
	}
});

module.exports = router;
