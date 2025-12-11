import Hero from "../components/layout/Hero";
import FeaturedCollection from "../components/products/FeaturedCollection";
import FeaturedSection from "../components/products/FeaturedSection";
import NewArrivals from "../components/products/NewArrivals";
import ProductDetails from "../components/products/ProductDetails";
import ProductGrid from "../components/products/ProductGrid";
import ProductsCollection from "../components/products/ProductsCollection";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import type { Product } from "../types/products";
import { useEffect, useState } from "react";
import { fetchProducts } from "../redux/slices/productsSlice";
import axios from "axios";

const Home = () => {
	const dispatch = useAppDispatch();
	const { products, loading, error } = useAppSelector(
		(state) => state.products
	);
	const [bestSellerProduct, setBestSellerProduct] = useState<Product | null>(
		null
	);

	useEffect(() => {
		// fetch all products
		dispatch(fetchProducts());
		// fetch best seller products
		const fetchBestSeller = async () => {
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`
				);
				setBestSellerProduct(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchBestSeller();
	}, [dispatch]);
	return (
		<div>
			<Hero />
			<ProductsCollection />
			<NewArrivals />
			{/* Best Seller */}
			<h2 className="text-3xl text-center font-bold mb-4">Best Seller</h2>
			{bestSellerProduct ? (
				<ProductDetails productId={bestSellerProduct._id} />
			) : (
				<p className="text-center">Loading best seller product...</p>
			)}

			<div className="container mx-auto">
				<h2 className="text-3xl text-center font-bold mb-4">Quill</h2>
				<ProductGrid products={products} loading={loading} error={error} />
			</div>
			<FeaturedCollection />
			<FeaturedSection />
		</div>
	);
};

export default Home;
