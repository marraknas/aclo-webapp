const express = require("express");
const router = express.Router();
const axios = require("axios");
const { protect } = require("../../middleware/authMiddleware");
const Product = require("../../models/Product");

/**
 * @route   POST /api/calculate-shipping
 * @desc    Calculate shipping costs using Biteship API
 * @access  Private
 */
router.post("/", protect, async (req, res) => {
try {
    const { destinationPostalCode, cartItems } = req.body;

    // Validate required fields
    if (!destinationPostalCode || !cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({
          success: false,
          message: "Missing required fields: destinationPostalCode and cartItems",
      });
    }

    // Validate postal code format (Indonesian postal codes are 5 digits)
    if (!/^\d{5}$/.test(destinationPostalCode)) {
        return res.status(400).json({
            success: false,
            message: "Invalid postal code format. Must be 5 digits.",
        });
    }

    // Get origin postal code from .env
    // TODO: set origin (sender) postal code in .env
    const originPostalCode = process.env.BITESHIP_ORIGIN_POSTAL_CODE;
    if (!originPostalCode) {
        console.error("BITESHIP_ORIGIN_POSTAL_CODE not configured");
        return res.status(500).json({
            success: false,
            message: "Shipping service not properly configured",
        });
    }
    const productIds = cartItems.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } }).select(
        "name dimensions weight"
    );

    const productMap = {};
    products.forEach((product) => {
        productMap[product._id.toString()] = product;
    });

    // Construct items array for Biteship API
    const biteshipItems = [];
    for (const cartItem of cartItems) {
        const product = productMap[cartItem.productId];
      
        if (!product) {
            console.log(`PRODUCT not found: ${cartItem.productId}`);
            return res.status(400).json({
            success: false,
            message: `Product Not Found: ${cartItem.productId}`,
            });
        }

        if (!product.weight || product.weight <= 0) {
            return res.status(400).json({
            success: false,
            message: `Product "${product.name}" does not have weight data configured`,
            });
        }

        biteshipItems.push({
            name: product.name,
            description: product.name,
            value: cartItem.price || 0,
            length: product.dimensions?.length || 10,
            width: product.dimensions?.width || 10,
            height: product.dimensions?.height || 5,
            weight: product.weight,
            quantity: cartItem.quantity || 1,
        });
    }

    // build request and send to Biteship API
    const biteshipApiKey = process.env.BITESHIP_API_KEY;
    if (!biteshipApiKey) {
        console.error("BITESHIP_API_KEY not configured");
        return res.status(500).json({
            success: false,
            message: "Shipping service not properly configured",
        });
    }

    // Currently requesting major Indonesian couriers: JNE, TIKI, Grab, J&T, SiCepat, AnterAja
    // to add more couriers in the future (eg Grab, Lalamove, DHL, etc):
    // - update the couriers field below with additional courier codes
    // - refer to biteship documentation: https://biteship.com/en/docs/api/couriers/overview
    const biteshipRequest = {
        origin_postal_code: originPostalCode,
        destination_postal_code: destinationPostalCode,
          couriers: "jne,tiki,grab,jnt,sicepat,anteraja",
        items: biteshipItems,
    };

    console.log("Biteship request:", JSON.stringify(biteshipRequest, null, 2));

    const biteshipResponse = await axios.post(
        "https://api.biteship.com/v1/rates/couriers",
        biteshipRequest,
        {
            headers: {
            Authorization: biteshipApiKey,
            "Content-Type": "application/json",
            },
        }
    );

    if (!biteshipResponse.data.success) {
        console.error("Biteship API error:", biteshipResponse.data);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve shipping rates",
        });
    }

    const pricing = biteshipResponse.data.pricing || [];
    
    if (pricing.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No shipping options available for this postal code",
        });
    }

    const shippingOptions = pricing.map((option) => ({
        courier_name: option.courier_name,
        courier_code: option.courier_code,
        courier_service_name: option.courier_service_name,
        courier_service_code: option.courier_service_code,
        description: option.description,
        duration: option.duration,
        price: option.price,
        type: option.type,
    }));

    shippingOptions.sort((a, b) => a.price - b.price);

    res.json({
        success: true,
        options: shippingOptions,
        origin: biteshipResponse.data.origin,
        destination: biteshipResponse.data.destination,
    });
  } catch (error) {
    console.error("Error calculating shipping cost:", error);
    
    if (error.response?.data) {
        return res.status(error.response.status || 500).json({
            success: false,
            message: error.response.data.message || "Failed to calculate shipping cost",
            error: error.response.data,
        });
    }

    res.status(500).json({
        success: false,
        message: "Failed to calculate shipping cost",
        error: error.message,
    });
  }
});

module.exports = router;
