import { useEffect, useRef, useState } from "react";
import ProductGrid from "../components/products/ProductGrid";
import { FaFilter } from "react-icons/fa6";
import FilterSidebar from "../components/products/FilterSidebar";
import SortOptions from "../components/products/SortOptions";
import type { Product } from "../types/products";

const CollectionPage = () => {
	const [products, setProducts] = useState<Product[]>([]);
	const sidebarRef = useRef<HTMLDivElement | null>(null);
	const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	const handleClickOutside = (e: MouseEvent) => {
		// close sidebar if clicked outside
		if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
			setIsSidebarOpen(false);
		}
	};

	useEffect(() => {
		// add event listener for clicks
		document.addEventListener("mousedown", handleClickOutside);
		// clean event listener on unmount
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	useEffect(() => {
		setTimeout(() => {
			const fetchedProducts: Product[] = [
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
			setProducts(fetchedProducts);
		}, 1000);
	}, []);
	return (
		<div className="flex flex-col lg:flex-row">
			{/* Mobile filter button */}
			<button
				onClick={toggleSidebar}
				className="lg:hidden border border-gray-200 p-2 flex justify-center items-center"
			>
				<FaFilter className="mr-2" /> Filters
			</button>
			{/* Filter sidebar */}
			<div
				ref={sidebarRef}
				className={`${
					isSidebarOpen ? "translate-x-0" : "-translate-x-full"
				} fixed inset-y-0 z-50 left-0 w-64 bg-white overflow-y-auto transition-transform duration-300 
                lg:static lg:translate-x-0`}
			>
				<FilterSidebar />
			</div>
			<div className="grow p-4">
				<h2 className="text-2xl uppercase mb-4">All Collection</h2>
				{/* Sort options */}
				<SortOptions />
				{/* Product Grid */}
				<ProductGrid products={products} />
			</div>
		</div>
	);
};

export default CollectionPage;
