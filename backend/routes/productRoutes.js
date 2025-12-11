const express = require("express");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// @route GET /api/products
// @desc Get all products with optional query filters and sorting
// @access Public
router.get("/", async (req, res) => {
	try {
		// note that filters are not used due to the small number of products we have
		// const { category, color, material, minPrice, maxPrice, sortBy, search } =
		// 	req.query;

		// let query = {};

		// filtering logic
		// if (category && category.toLocaleLowerCase() !== "all") {
		// 	query.categories = category;
		// }
		// if (material) {
		// 	query.material = { $in: material.split(",") };
		// }
		// if (minPrice || maxPrice) {
		//     query.price = {};
		//     if (minPrice) query.price.$gte = Number(minPrice);
		//     if (maxPrice) query.price.$lte = Number(maxPrice);
		// }
		// if (search) {
		// 	query.$or = [
		// 		{
		// 			name: { $regex: search, $options: "i" },
		// 			description: { $regex: search, $options: "i" },
		// 		}, // i is case insensitive
		// 	];
		// }
		// let sort = {};
		// if (sortBy) {
		// 	switch (sortBy) {
		// 		case "priceAsc":
		// 			sort = { price: 1 };
		// 			break;
		// 		case "priceDesc":
		// 			sort = { price: -1 };
		// 			break;
		// 		case "popularity":
		// 			sort = { rating: -1 };
		// 			break;
		// 		default:
		// 			break;
		// 	}
		// }

		// fetch products and apply sorting andn limit
		// let products = await Product.find(query)
		// 	.sort(sort)
		// 	.limit(Number(limit) || 0);
		const products = await Product.find(); // no filter = get all
		res.json(products);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server Error" });
	}
});

// @route GET /api/products/best-seller
// @desc Retrieve product with highest rating
// @access Public
router.get("/best-seller", async (req, res) => {
	try {
		const bestSeller = await Product.findOne().sort({ rating: -1 });
		if (bestSeller) {
			res.json(bestSeller);
		} else {
			res.status(404).json({ message: "No best seller found" });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server Error" });
	}
});

// @route GET /api/products/new-arrivals
// @desc Retrieve latest 2 products based on Creation Date
// @access Public
router.get("/new-arrivals", async (req, res) => {
	try {
		// fetch latest 2 products
		const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(2);
		res.json(newArrivals);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server Error" });
	}
});

// @route GET /api/products/:id
// @desc Get a single product by ID
// @access Public
router.get("/:id", async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (product) {
			res.json(product);
		} else {
			res.status(404).json({ message: "Product Not Found" });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server Error" });
	}
});

// @route GET /api/products/similar/:id
// @desc Retrieve similar products based on current product's category
// @access Public
router.get("/similar/:id", async (req, res) => {
	const { id } = req.params;
	console.log(id);
	try {
		const product = await Product.findById(id);
		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		const similarProducts = await Product.find({
			_id: { $ne: id }, // exclude the current product's ID
			category: product.category,
		}).limit(4);

		res.json(similarProducts);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server Error" });
	}
});

module.exports = router;
