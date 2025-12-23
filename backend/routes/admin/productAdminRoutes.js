const express = require("express");
const mongoose = require("mongoose");
const Product = require("../../models/Product");
const ProductVariant = require("../../models/ProductVariant");
const { protect, admin } = require("../../middleware/authMiddleware");

const router = express.Router();

// NOTE: I am keeping this just in case in the future, we want to filter 
// what is returned from public products and admin products

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

// TODO: Finish implementing this. Don't call this API yet
// @route POST /api/admin/products
// @desc Create Product + default ProductVariant
// @access Private/Admin
router.post("/", protect, admin, async (req, res) => {
	try {
		const {
			name,
			description,
			price,
			discountPrice,
			sku,
			countInStock,
			category,
			options,
			addOnProducts,
			images,
			isListed,
			dimensions,
			weight,
		} = req.body;

		const createdProduct = await Product.create({
			name,
			description,
			options,
			addOnProducts,
			images,
			isListed,
			dimensions,
			weight,
			user: req.user._id, // reference to admin user who created product
		});

		const createdProductVariant = await ProductVariant.create({
			productId: createdProduct._id,
			sku,
			price,
			discountPrice,
			countInStock,
			category,
			// put default values for now, need to cartesian product next time if needed
			color: options?.color?.[0],
			variant: options?.variant?.[0],
			images,
		});

		res
			.status(201)
			.json({ Product: createdProduct, ProductVariant: createdProductVariant });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server Error" });
	}
});

// TODO: separate the PUT API for product and productVariant.
// @route PUT /api/admin/products/:id
// @desc Update Product fields + related ProductVariant fields (default variant)
// @access Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
	const session = await mongoose.startSession();
	try {
		const {
			// Product fields
			name,
			description,
			options,
			addOnProducts,
			images, // just Product
			isListed,
			dimensions,
			weight,

			applyToAll, // flag to check if a global update is wanted
			// variant fields
			variantId, // <-- target the variant's ID
			sku,
			price,
			discountPrice,
			countInStock,
			category,
			color,
			variant,
			variantImages,
		} = req.body;

		let updatedProduct = null;
		let updatedVariant = null;
		let updatedAllCount = 0;

		await session.withTransaction(async () => {
			// find product by ID from url param
			const product = await Product.findById(req.params.id).session(session);
			if (!product) {
				res.status(404).json({ message: "Product not found" });
				return;
			}

			if (name != undefined) product.name = name;
			if (description !== undefined) product.description = description;
			if (options !== undefined) product.options = options;
			if (addOnProducts !== undefined) product.addOnProducts = addOnProducts;
			if (images !== undefined) product.images = images;
			if (isListed !== undefined) product.isListed = isListed;
			if (dimensions !== undefined) product.dimensions = dimensions;
			if (weight !== undefined) product.weight = weight;
			updatedProduct = await product.save({ session });

			const productVariants = await ProductVariant.find({
				productId: product._id,
			}).session(session);

			if (!productVariants.length) {
				res.status(404).json({ message: "No variants found for this product" });
				return;
			}

			if (applyToAll) {
				// only price and discountPrice can be globally updated
				const globalVariantUpdate = {};
				if (price !== undefined) globalVariantUpdate.price = price;
				if (discountPrice !== undefined)
					globalVariantUpdate.discountPrice = discountPrice;

				if (Object.keys(globalVariantUpdate).length) {
					const r = await ProductVariant.updateMany(
						{ productId: product._id },
						{ $set: globalVariantUpdate },
						{ session }
					);
					updatedAllCount = r.modifiedCount ?? 0;
				}
			}

			// variant specific updates, if any
			const hasVariantSpecificFields =
				sku !== undefined ||
				countInStock !== undefined ||
				category !== undefined ||
				color !== undefined ||
				variant !== undefined ||
				variantImages !== undefined ||
				(applyToAll !== true &&
					(price !== undefined || discountPrice !== undefined));

			if (hasVariantSpecificFields) {
				if (!variantId) {
					res.status(400).json({
						message:
							"variantId is required when updating variant-specific fields.",
					});
					return;
				}

				const pv = await ProductVariant.findOne({
					_id: variantId,
					productId: product._id, // safety: must belong to this product
				}).session(session);

				if (!pv) {
					res
						.status(404)
						.json({ message: "Variant not found for this product" });
					return;
				}

				// If applyToAll is false, price/discountPrice mean "this variant only"
				if (!applyToAll) {
					if (price !== undefined) pv.price = price;
					if (discountPrice !== undefined) pv.discountPrice = discountPrice;
				}

				if (sku !== undefined) pv.sku = sku;
				if (countInStock !== undefined) pv.countInStock = countInStock;
				if (category !== undefined) pv.category = category;
				if (color !== undefined) pv.color = color;
				if (variant !== undefined) pv.variant = variant;

				if (variantImages !== undefined) {
					pv.images = variantImages; // variant-specific images
				}

				updatedVariant = await pv.save({ session });
			}
		});
		// If transaction returned early due to 404, stop here (response already sent)
		if (res.headersSent) return;

		return res.json({
			product: updatedProduct,
			updatedAllVariants: updatedAllCount,
			productVariant: updatedVariant,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server Error" });
	} finally {
		session.endSession();
	}
});

// @route DELETE /api/admin/products/:id
// @desc Delete a product by ID
// @access Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
	const session = await mongoose.startSession();
	try {
		await session.withTransaction(async () => {
			const product = await Product.findById(req.params.id).session(session);
			if (!product) {
				res.status(404).json({ message: "Product not found" });
				return;
			}

			// delete all variants first
			await ProductVariant.deleteMany({ productId: product._id }).session(
				session
			);

			// delete the product
			await product.deleteOne({ session });
		});

		if (res.headersSent) return;
		return res.json({ message: "Product and all variants removed" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Server Error" });
	} finally {
		session.endSession();
	}
});

// @route DELETE /api/admin/products/:id/variant/:variantId
// @desc Delete a product Variant
// @access Private/Admin
router.delete("/:id/variants/:variantId", protect, admin, async (req, res) => {
	const session = await mongoose.startSession();

	try {
		const { id, variantId } = req.params;

		await session.withTransaction(async () => {
			const product = await Product.findById(id).session(session);
			if (!product) {
				res.status(404).json({ message: "Product not found" });
				return;
			}

			const pv = await ProductVariant.findOne({
				_id: variantId,
				productId: id,
			}).session(session);

			if (!pv) {
				res.status(404).json({ message: "Variant not found for this product" });
				return;
			}

			// Capture the option values we want to remove
			const deletedColor = pv.color;
			const deletedVariant = pv.variant;

			// Delete the variant
			await pv.deleteOne({ session });

			// Build a $pull update for Product.options
			const pullUpdate = {};

			if (deletedColor) {
				pullUpdate["options.color"] = deletedColor;
			}
			if (deletedVariant) {
				pullUpdate["options.variant"] = deletedVariant;
			}

			// Apply pull if needed
			if (Object.keys(pullUpdate).length) {
				await Product.updateOne(
					{ _id: id },
					{ $pull: pullUpdate },
					{ session }
				);
			}
		});

		if (res.headersSent) return;
		return res.json({
			message: "Variant removed (product options pruned if unused)",
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Server Error" });
	} finally {
		session.endSession();
	}
});

module.exports = router;
