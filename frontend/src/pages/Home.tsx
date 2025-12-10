import Hero from "../components/layout/Hero";
import FeaturedCollection from "../components/products/FeaturedCollection";
import FeaturedSection from "../components/products/FeaturedSection";
import NewArrivals from "../components/products/NewArrivals";
import ProductDetails from "../components/products/ProductDetails";
import ProductGrid from "../components/products/ProductGrid";
import ProductsCollection from "../components/products/ProductsCollection";
import type { Product } from "../types/products";

const placeholderProducts: Product[] = [
	{
		_id: "5",
		name: "Product 1",
		description: "Description for Product 1",
		price: 21000,
		countInStock: 10,
		sku: "PROD1",
		category: "Stool",
		images: [{ url: "https://picsum.photos/500/500?random=12" }],
		isFeatured: true,
		isPublished: true,
		rating: 4.5,
		numReviews: 10,
		user: "user123",
	},
	{
		_id: "6",
		name: "Product 2",
		description: "Description for Product 2",
		price: 22000,
		countInStock: 10,
		sku: "PROD2",
		category: "Learning Tower",
		images: [{ url: "https://picsum.photos/500/500?random=13" }],
		isFeatured: true,
		isPublished: true,
		rating: 4.5,
		numReviews: 10,
		user: "user123",
	},
	{
		_id: "7",
		name: "Product 3",
		description: "Description for Product 3",
		price: 24000,
		countInStock: 10,
		sku: "PROD3",
		category: "Stool",
		images: [{ url: "https://picsum.photos/500/500?random=14" }],
		isFeatured: true,
		isPublished: true,
		rating: 4.5,
		numReviews: 10,
		user: "user123",
	},
	{
		_id: "8",
		name: "Product 4",
		description: "Description for Product 4",
		price: 29000,
		countInStock: 10,
		sku: "PROD4",
		category: "Accessories",
		images: [{ url: "https://picsum.photos/500/500?random=15" }],
		isFeatured: true,
		isPublished: true,
		rating: 4.5,
		numReviews: 10,
		user: "user123",
	},
	{
		_id: "9",
		name: "Product 5",
		description: "Description for Product 5",
		price: 49000,
		countInStock: 10,
		sku: "PROD5",
		category: "Utensils",
		images: [{ url: "https://picsum.photos/500/500?random=16" }],
		isFeatured: true,
		isPublished: true,
		rating: 4.5,
		numReviews: 10,
		user: "user123",
	},
	{
		_id: "10",
		name: "Product 6",
		description: "Description for Product 6",
		price: 229000,
		countInStock: 10,
		sku: "PROD6",
		category: "Utensils",
		images: [{ url: "https://picsum.photos/500/500?random=17" }],
		isFeatured: true,
		isPublished: true,
		rating: 4.5,
		numReviews: 10,
		user: "user123",
	},
	{
		_id: "11",
		name: "Product 7",
		description: "Description for Product 7",
		price: 291000,
		countInStock: 10,
		sku: "PROD7",
		category: "Utensils",
		images: [{ url: "https://picsum.photos/500/500?random=18" }],
		isFeatured: true,
		isPublished: true,
		rating: 4.5,
		numReviews: 10,
		user: "user123",
	},
	{
		_id: "12",
		name: "Product 8",
		description: "Description for Product 8",
		price: 329000,
		countInStock: 10,
		sku: "PROD8",
		category: "Stool",
		images: [{ url: "https://picsum.photos/500/500?random=19" }],
		isFeatured: true,
		isPublished: true,
		rating: 4.5,
		numReviews: 10,
		user: "user123",
	},
];

const Home = () => {
	return (
		<div>
			<Hero />
			<ProductsCollection />
			<NewArrivals />
			{/* Best Seller */}
			<h2 className="text-3xl text-center font-bold mb-4">Best Seller</h2>
			<ProductDetails />

			<div className="container mx-auto">
				<h2 className="text-3xl text-center font-bold mb-4">Quill</h2>
				<ProductGrid products={placeholderProducts} />
			</div>
			<FeaturedCollection />
			<FeaturedSection />
		</div>
	);
};

export default Home;
