const express = require("express");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// @route POST /api/products
// @desc Create a new Product in DB
// @access Private/Admin

router.post("/", protect, admin, async (req, res) => {
	try {
		const {
			name,
			description,
			price,
			discountPrice,
			countInStock,
			sku,
			category,
			options,
			material,
			images,
			isFeatured,
			isPublished,
			dimensions,
			weight,
		} = req.body;

		const product = new Product({
			name,
			description,
			price,
			discountPrice,
			countInStock,
			sku,
			category,
			options,
			material,
			images,
			isFeatured,
			isPublished,
			dimensions,
			weight,
			user: req.user._id, // reference to admin user who created product
		});

		const createdProduct = await product.save();
		res.status(201).json(createdProduct);
	} catch (error) {
		console.error(error);
		res.status(500).send("Server Error");
	}
});

// @route PUT /api/products/:id
// @desc Update an existing product ID
// @access Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
	try {
		const {
			name,
			description,
			price,
			discountPrice,
			countInStock,
			sku,
			category,
			options,
			material,
			images,
			isFeatured,
			isPublished,
			dimensions,
			weight,
		} = req.body;

		// find product by ID from url param
		const product = await Product.findById(req.params.id);

		if (product) {
			// Update product fields
			product.name = name || product.name;
			product.description = description || product.description;
			product.price = price || product.price;
			product.discountPrice = discountPrice || product.discountPrice;
			product.countInStock = countInStock || product.countInStock;
			product.sku = sku || product.sku;
			product.category = category || product.category;
			product.options = options || product.options;
			product.material = material || product.material;
			product.images = images || product.images;
			product.isFeatured =
				isFeatured !== undefined ? isFeatured : product.isFeatured;
			product.isPublished =
				isPublished !== undefined ? isPublished : product.isPublished;
			product.dimensions = dimensions || product.dimensions;
			product.weight = weight || product.weight;

			// save the updated product
			const updatedProduct = await product.save();
			res.json(updatedProduct);
		} else {
			res.status(404).json({ message: "Product not Found" });
		}
	} catch (error) {
		console.error(error);
		res.status(500).send("Server Error");
	}
});

// @route DELETE /api/products/:id
// @desc Delete a product by ID
// @access Private/Admin

router.delete("/:id", protect, admin, async (req, res) => {
	try {
		// find the product by ID
		const product = await Product.findById(req.params.id);

		if (product) {
			// Remove the product from DB
			await product.deleteOne();
			res.json({ message: "Product removed" });
		} else {
			res.status(404).json({ message: "Product not found" });
		}
	} catch (error) {
		console.error(error);
		res.status(500).send("Server Error");
	}
});

// @route GET /api/products
// @desc Get all products with optional query filters and sorting
// @access Public
router.get("/", async (req, res) => {
	try {
		// note that filters may not even be used due to the small number of products we have
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
		res.status(500).send("Server Error");
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
		res.status(500).send("Server Error");
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
		res.status(500).send("Server Error");
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
		res.status(500).send("Server Error");
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
		res.status(500).send("Server Error");
	}
});

module.exports = router;
