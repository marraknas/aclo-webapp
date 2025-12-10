const express = require("express");
const Subscriber = require("../models/Subscriber");

const router = express.Router();

// @route POST /api/subscribe
// @desc Handle news letter subscriptions
// @access Public
router.post("/", async (req, res) => {
	const { email } = req.body;

	if (!email) {
		return res.status(400).json({ message: "Email is Required" });
	}

	try {
		// check if email is already subscribed
		let subscriber = await Subscriber.findOne({ email });

		if (subscriber) {
			return res.status(400).json({ message: "Email Already Subscribed" });
		}

		// Create a new subscriber
		subscriber = new Subscriber({ email });
		await subscriber.save();

		res.status(201).json({ message: "Successfully Subscribed to Newsletter" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server Error" });
	}
});

module.exports = router;
