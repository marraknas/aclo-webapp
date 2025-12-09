const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const User = require("./models/User");
const Cart = require("./models/Cart");
const products = require("./data/products");

dotenv.config();

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI);

// function to seed data
const seedData = async () => {
	try {
		// clear existing data
		await Product.deleteMany();
		await User.deleteMany();
		await Cart.deleteMany();

		// create default admin user
		const createdUser = await User.create({
			name: "Admin User",
			email: "admin@example.com",
			password: "123456",
			role: "admin",
		});

		// assign default user ID to each product
		const userID = createdUser._id;
		const sampleProducts = products.map((product) => {
			return { ...product, user: userID };
		});

		// insert products into the database
		await Product.insertMany(sampleProducts);
		console.log("Product data seeded successfully");
		process.exit();
	} catch (error) {
		console.error("Error seeding the data: ", error);
		process.exit(1);
	}
};

seedData();
