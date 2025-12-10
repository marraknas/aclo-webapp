const express = require("express");
const dotenv = require("dotenv");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

dotenv.config();
const router = express.Router();

// Cloudinary configuration
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer setup using memory storage
const storage = multer.memoryStorage(); // we are telling multer to store the uploaded files directly in RAM as Buffer objs rather than saving them to a file system
const upload = multer({ storage }); // upload used as middleware to handle file uploads

router.post("/", upload.single("image"), async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ message: "No File Uploaded" });
		}

		// helper function to handle stream upload to Cloudinary
		const streamUpload = (fileBuffer) => {
			return new Promise((resolve, reject) => {
				const stream = cloudinary.uploader.upload_stream((error, result) => {
					if (result) {
						resolve(result);
					} else {
						reject(error);
					}
				});

				// use streamifier to convert file buffer to stream
				streamifier.createReadStream(fileBuffer).pipe(stream);
			});
		};
		// Call the streamUpload function
		const result = await streamUpload(req.file.buffer);

		// Respond with uploaded image URL
		res.json({ imageUrl: result.secure_url });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server Error" });
	}
});

module.exports = router;
