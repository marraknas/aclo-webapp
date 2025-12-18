const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const User = require("./models/User");
const Cart = require("./models/Cart");
const Order = require("./models/Order");
const Review = require("./models/Review");
const products = require("./data/products");
const reviews = require("./data/reviews");
const orders = require("./data/orders");

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
		await Review.deleteMany();
		await Order.deleteMany();

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
		const insertedProducts = await Product.insertMany(sampleProducts);
		// retrieve the first product
		const p0 = insertedProducts[0];

		const sampleOrders = orders.map((order) => {
			return {
				...order,
				user: userID,
				orderItems: [
					{
						productId: p0._id,
						name: p0.name,
						image: p0.images?.[0]?.url || "",
						price: p0.price,
						quantity: 1,
					},
				],
			};
		});

		// insert products & reviews into the database

		await Review.insertMany(reviews);
		await Order.insertMany(sampleOrders);

		console.log("Mock data seeded successfully");
		process.exit();
	} catch (error) {
		console.error("Error seeding the data: ", error);
		process.exit(1);
	}
};

seedData();
