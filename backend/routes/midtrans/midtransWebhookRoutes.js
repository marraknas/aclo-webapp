const express = require("express");
const crypto = require("crypto");
const Checkout = require("../../models/Checkout");

const router = express.Router();

router.post("/notification", async (req, res) => {
    try {
        const n = req.body;

        // verify signature key
        const raw = `${n.order_id}${n.status_code}${n.gross_amount}${process.env.MIDTRANS_SERVER_KEY}`;
        const expected = crypto.createHash("sha512").update(raw).digest("hex");

        if (expected !== n.signature_key) {
            return res.status(401).json({ message: "Invalid signature" });
        }

        const checkout = await Checkout.findById(n.order_id);
        if (!checkout)
            return res.status(404).json({ message: "Checkout not found" });

        const status = n.transaction_status; // settlement, pending, deny, expire, cancel, capture
        const fraud = n.fraud_status;

        if (status === "settlement") {
            checkout.isPaid = true;
            checkout.paymentStatus = "paid";
            checkout.paidAt = new Date();
        } else if (status === "capture") {
            if (fraud === "accept") {
                checkout.isPaid = true;
                checkout.paymentStatus = "paid";
                checkout.paidAt = new Date();
            } else {
                checkout.isPaid = false;
                checkout.paymentStatus = "challenge";
            }
        } else if (status === "pending") {
            checkout.isPaid = false;
            checkout.paymentStatus = "pending";
        } else if (["deny", "cancel", "expire"].includes(status)) {
            checkout.isPaid = false;
            checkout.paymentStatus = "failed";
        } else {
            checkout.paymentStatus = status || "pending";
        }

        checkout.paymentDetails = n;
        await checkout.save();

        return res.status(200).json({ received: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Webhook error" });
    }
});

module.exports = router;
