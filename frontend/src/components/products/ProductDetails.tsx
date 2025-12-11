import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import ProductGrid from "./ProductGrid";
import { COLOR_MAP } from "../../constants/colors";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
	fetchProductDetails,
	fetchSimilarProducts,
} from "../../redux/slices/productsSlice";
import { addToCart } from "../../redux/slices/cartSlice";

type ProductDetailsProps = {
	productId?: string; // used when Home passes bestSeller productId
};

const ProductDetails = ({ productId }: ProductDetailsProps) => {
	const { id } = useParams<{ id: string }>();
	const dispatch = useAppDispatch();
	const { selectedProduct, loading, error, similarProducts } = useAppSelector(
		(state) => state.products
	);
	const { userId, guestId } = useAppSelector((state) => state.auth);
	const [mainImage, setMainImage] = useState<string>("");
	const [selectedStabiliser, setSelectedStabiliser] = useState<string>("");
	const [selectedColor, setSelectedColor] = useState<string>("");
	const [quantity, setQuantity] = useState<number>(1);
	const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false); // for disabling add to cart button during processing

	const productFetchId = productId || id;

	// when product changes, change main image
	useEffect(() => {
		if (selectedProduct?.images?.[0]?.url) {
			setMainImage(selectedProduct.images[0].url);
		}
	}, [selectedProduct]);

	useEffect(() => {
		if (productFetchId) {
			dispatch(fetchProductDetails({ id: productFetchId }));
			dispatch(fetchSimilarProducts({ id: productFetchId }));
		}
	}, [dispatch, productFetchId]);

	const handleQuantityChange = (action: string) => {
		if (action === "incr") setQuantity((prev) => prev + 1);
		if (action === "decr" && quantity > 1) setQuantity((prev) => prev - 1);
	};
	const handleAddToCart = () => {
		if (!selectedStabiliser || !selectedColor) {
			toast.error(
				"Please select a color and stabiliser option before adding to cart.",
				{
					duration: 1000,
				}
			);
			return;
		}
		setIsButtonDisabled(true);
		dispatch(
			addToCart({
				productId: productFetchId,
				quantity,
				options,
				guestId,
				userId: userId,
			})
		)
			.then(() => {
				toast.success("Product added to cart!", {
					duration: 1000,
				});
			})
			.finally(() => {
				setIsButtonDisabled(false);
			});
	};

	if (loading) {
		return <p>Loading...</p>;
	}

	if (error) {
		return <p>Error: {error}</p>;
	}

	return (
		<div className="p-6">
			{selectedProduct && (
				<div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
					<div className="flex flex-col md:flex-row">
						{/* Left thumbnails */}
						<div className="hidden md:flex flex-col space-y-4 mr-6">
							{selectedProduct.images.map((image, index) => (
								<img
									key={index}
									src={image.url}
									alt={image.altText || `Thumbnail ${index}`}
									className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
										mainImage === image.url ? "border-black" : "border-gray-200"
									}`}
									onClick={() => setMainImage(image.url)}
								/>
							))}
						</div>
						{/* Main Image */}
						<div className="md:w-1/2">
							<div className="mb-4">
								<img
									src={mainImage}
									alt="Main Product"
									className="w-full h-auto object-cover rounded-lg"
								/>
							</div>
						</div>
						{/* Mobile thumbnails */}
						<div className="md:hidden flex overscroll-x-scroll space-x-4 mb-4 ">
							{selectedProduct.images.map((image, index) => (
								<img
									key={index}
									src={image.url}
									alt={image.altText || `Thumbnail ${index}`}
									className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
										mainImage === image.url ? "border-black" : "border-gray-200"
									}`}
									onClick={() => setMainImage(image.url)}
								/>
							))}
						</div>
						{/* Right side */}
						<div className="md:w-1/2 md:ml-10">
							<h1 className="text-2xl md:text-3xl font-semibold mb-2">
								{selectedProduct.name}
							</h1>
							<p className="text-lg text-gray-600 mb-1 line-through">
								{selectedProduct.originalPrice &&
									`IDR ${selectedProduct.originalPrice}`}
							</p>
							<p className="text-xl text-gray-500 mb-2">
								IDR {selectedProduct.price}
							</p>
							<p className="text-gray-600 mb-4">
								{selectedProduct.description}
							</p>
							<div className="mb-4">
								<p className="text-gray-700">Color:</p>
								<div className="flex gap-2 mt-2">
									{selectedProduct.options.colors.map((color) => (
										<button
											key={color}
											onClick={() => setSelectedColor(color)}
											className={`w-8 h-8 rounded-full border ${
												selectedColor === color
													? "border-4 border-black"
													: "border-gray-200"
											}`}
											style={{
												backgroundColor: COLOR_MAP[color] ?? "#e5e7eb", // fallback gray
												filter: "brightness(0.9)",
											}}
										></button>
									))}
								</div>
							</div>
							<div className="mb-4">
								<p className="text-gray-700">Stabiliser:</p>
								<div className="flex gap-2 mt-2">
									{selectedProduct.options.stabiliser.map((stabiliser) => (
										<button
											key={stabiliser}
											onClick={() => setSelectedStabiliser(stabiliser)}
											className={`px-4 py-2 rounded border ${
												selectedStabiliser === stabiliser
													? "bg-black text-white"
													: ""
											}`}
										>
											{stabiliser}
										</button>
									))}
								</div>
							</div>
							<div className="mb-6">
								<p className="text-gray-700">Quantity:</p>
								<div className="flex items-center space-x-4 mt-2">
									<button
										onClick={() => handleQuantityChange("decr")}
										className="px-2.5 py-1 bg-gray-200 rounded text-lg"
									>
										-
									</button>
									<span className="text-lg">{quantity}</span>
									<button
										onClick={() => handleQuantityChange("incr")}
										className="px-2 py-1 bg-gray-200 rounded text-lg"
									>
										+
									</button>
								</div>
							</div>
							<button
								onClick={handleAddToCart}
								disabled={isButtonDisabled}
								className={`bg-black text-white py-2 px-6 rounded w-full mb-4 ${
									isButtonDisabled
										? "cursor-not-allowed opacity-50"
										: "hover:bg-gray-800"
								}`}
							>
								{isButtonDisabled ? "Adding..." : "ADD TO CART"}
							</button>
							<div className="mt-10 text-gray-700">
								<h3 className="text-xl font-bold mb-4">Characteristics:</h3>
								<table className="w-full text-left text-sm text-gray-600">
									<tbody>
										<tr>
											<td className="py-1">Material</td>
											<td className="py-1">{selectedProduct.material}</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
					<div className="mt-20">
						<h2 className="text-2xl text-center font-medium mb-4">
							You May Also Like
						</h2>
						<ProductGrid
							products={similarProducts}
							loading={loading}
							error={error}
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default ProductDetails;
