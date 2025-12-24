const express = require("express");
const mongoose = require("mongoose");
const Checkout = require("../models/Checkout");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const ProductVariant = require("../models/ProductVariant");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// @route POST /api/checkout
// @desc Create a new checkout session
// @access Private
router.post("/", protect, async (req, res) => {
  const { checkoutItems, shippingDetails, paymentMethod, totalPrice } =
    req.body;
  if (!checkoutItems || checkoutItems.length === 0) {
    return res.status(400).json({ message: "No Items in Checkout" });
  }

  try {
    // VALIDATION FOR CHECKOUT, can modify/remove
    for (const item of checkoutItems) {
      const { productId, productVariantId, options, quantity } = item;
      if (
        !productId ||
        !productVariantId ||
        !quantity ||
        !options ||
        quantity < 1
      ) {
        return res
          .status(400)
          .json({ message: "Invalid checkout item payload" });
      }

      const product = await Product.findById(productId).select("name");
      if (!product)
        return res.status(404).json({ message: "Product Not Found" });

      const pv = await ProductVariant.findOne({
        _id: productVariantId,
        productId: productId,
      });
      if (!pv)
        return res.status(404).json({ message: "ProductVariant Not Found" });

      // don’t reserve stock here, only validate basic availability
      if (pv.countInStock < quantity) {
        return res.status(400).json({
          message: `Insufficient stock for SKU ${pv.sku}. Available: ${pv.countInStock}`,
        });
      }
    }

    // Create a new checkout session
    const newCheckout = await Checkout.create({
      user: req.user._id,
      checkoutItems: checkoutItems,
      shippingDetails: shippingDetails,
      paymentMethod,
      totalPrice,
      paymentStatus: "pending",
      isPaid: false,
    });

    res.status(201).json(newCheckout);
  } catch (error) {
    console.error("Error creating checkout session: ", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route PUT /api/checkout/:id/pay
// @desc Update checkout to mark as paid after successful payment
// @access Private
router.put("/:id/pay", protect, async (req, res) => {
  const { paymentStatus, paymentDetails } = req.body;

  try {
    // find checkout session by url id passed in param
    const checkout = await Checkout.findById(req.params.id);

    if (!checkout) {
      return res.status(404).json({ message: "Checkout Not Found" });
    }

    if (paymentStatus === "paid") {
      checkout.isPaid = true;
      checkout.paymentStatus = paymentStatus;
      checkout.paymentDetails = paymentDetails;
      checkout.paidAt = Date.now();
      await checkout.save();

      res.status(200).json(checkout);
    } else {
      res.status(400).json({ message: "Invalid Payment Status" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @router POST /api/checkout/:id/finalize
// @desc Finalize checkout and convert to an order after payment confirmation
// @access Private
router.post("/:id/finalize", protect, async (req, res) => {
  const session = await mongoose.startSession();
  try {
    let finalOrder;

    await session.withTransaction(async () => {
      const checkout = await Checkout.findById(req.params.id);
      if (!checkout) {
        return res.status(404).json({ message: "Checkout Not Found" });
      }

      if (!checkout.isPaid) {
        res.status(400).json({ message: "Checkout is Not Paid" });
        return;
      }

      if (checkout.isFinalized) {
        res.status(400).json({ message: "Checkout Already Finalized" });
        return;
      }

      // decrement stock atomically for each variant
      for (const item of checkout.checkoutItems) {
        const r = await ProductVariant.updateOne(
          {
            _id: item.productVariantId,
            productId: item.productId,
            countInStock: { $gte: item.quantity },
          },
          { $inc: { countInStock: -item.quantity } },
          { session }
        );

        if ((r.modifiedCount ?? 0) !== 1) {
          // fail if insufficient stock or variant not found
          res.status(400).json({
            message: "Insufficient stock while finalizing.",
            productVariantId: item.productVariantId,
          });
          return;
        }
      }

      // Create final order
      finalOrder = await Order.create(
        [
          {
            user: checkout.user,
            orderItems: checkout.checkoutItems,
            shippingDetails: checkout.shippingDetails,
            paymentMethod: checkout.paymentMethod,
            totalPrice: checkout.totalPrice,
            isPaid: true,
            paidAt: checkout.paidAt,
            isDelivered: false,
            paymentStatus: "paid",
            paymentDetails: checkout.paymentDetails,
          },
        ],
        { session }
      ).then((r) => r[0]);

      // Mark checkout finalized
      checkout.isFinalized = true;
      checkout.finalizedAt = Date.now();
      await checkout.save({ session });

      // Delete user cart
      await Cart.findOneAndDelete({ user: checkout.user }).session(session);
    });
    if (res.headersSent) return;
    res.status(201).json(finalOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  } finally {
    session.endSession();
  }
});

module.exports = router;
