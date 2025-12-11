const express = require("express");
const Product = require("../../models/Product");
const { protect, admin } = require("../../middleware/authMiddleware");

const router = express.Router();

// @route GET /api/admin/products
// @desc Get all products (Admin only)
// @access Private/Admin
router.get("/", protect, admin, async (req, res) => {
	try {
		const products = await Product.find({});
		res.json(products);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server Error" });
	}
});

// @route POST /api/admin/products
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
		res.status(500).json({ message: "Server Error" });
	}
});

// @route PUT /api/admin/products/:id
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
		res.status(500).json({ message: "Server Error" });
	}
});

// @route DELETE /api/admin/products/:id
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
		res.status(500).json({ message: "Server Error" });
	}
});

module.exports = router;
