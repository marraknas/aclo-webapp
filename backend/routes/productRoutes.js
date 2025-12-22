const express = require("express");
const Product = require("../models/Product");
const ProductVariant = require("../models/ProductVariant");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// @route GET /api/products
// @desc Get all products with optional query filters and sorting
// @access Public
router.get("/", async (req, res) => {
	try {
		const products = await Product.find(); // no filter = get all
		res.json(products);
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
	try {
		const product = await Product.findById(id);
		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		const baseVariant = await ProductVariant.findOne({ productId: id }).lean();
		if (!baseVariant)
			return res.status(404).json({ message: "No variants found" });

		const similarVariants = await ProductVariant.find({
			productId: { $ne: id },
			category: baseVariant.category,
		})
			.select("productId")
			.limit(4)
			.lean();

		const productIds = [
			...new Set(similarVariants.map((v) => String(v.productId))),
		];

		const similarProducts = await Product.find({ _id: { $in: productIds } });
		return res.json(similarProducts);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server Error" });
	}
});

// @route GET /api/products/:id/variant?color=Red&variant=Stork
// @desc Get a single product variant (and its details)
// @access Public
router.get("/:id/variant", async (req, res) => {
	try {
		const { id } = req.params;
		const { color, variant, productVariantId } = req.query;

		const q = { productId: id };
		if (productVariantId) {
            // Logic: If ID is provided, strictly match by that ID
            q._id = productVariantId;
        } else {
            // Logic: Fallback to attributes if no ID is present
            if (color != null) q.color = color;
            if (variant != null) q.variant = variant;
        }

		// fetch default variant if no params are given
		const pv = await ProductVariant.findOne(q).sort({ isDefault: -1 });
		if (!pv)
			return res.status(404).json({ message: "Matching variant not found" });

		return res.json(pv); // returns the variantId in the _id field
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Server Error" });
	}
});

// @route GET /api/products/:id
// @desc Get a single product (and its details) by ID
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

module.exports = router;
