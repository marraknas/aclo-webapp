import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProductDetails } from "../../redux/slices/productsSlice";
import { updateProduct } from "../../redux/slices/adminProductSlice";
import { API_URL } from "../../constants/api";
import axios from "axios";
import type { Product, ProductImage } from "../../types/products";

type ProductData = {
	name: string;
	description: string;
	price: number;
	countInStock: number;
	sku: string;
	category: Product["category"];
	images: ProductImage[];
	color: string[]; // will be stored in options.color when submitted (if any)
	material: string;
};

const EditProductPage = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { id } = useParams();
	const { selectedProduct, loading, error } = useAppSelector(
		(state) => state.products
	);
	const [productData, setProductData] = useState<ProductData>({
		name: "",
		description: "",
		price: 0,
		countInStock: 0,
		sku: "",
		category: "Learning Tower",
		color: [],
		material: "",
		images: [],
	});

	const [uploading, setUploading] = useState<boolean>(false);
	useEffect(() => {
		if (id) {
			dispatch(fetchProductDetails({ id }));
		}
	}, [dispatch, id]);

	// map selectedProduct -> local ProductData
	useEffect(() => {
		if (selectedProduct) {
			setProductData({
				name: selectedProduct.name,
				description: selectedProduct.description,
				price: selectedProduct.price,
				countInStock: selectedProduct.countInStock,
				sku: selectedProduct.sku,
				category: selectedProduct.category,
				images: selectedProduct.images ?? [],
				color: selectedProduct.options?.color ?? [],
				material: selectedProduct.material ?? "",
			});
		}
		// console.log(productData);
	}, [selectedProduct]);

	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		const key = name as keyof ProductData; // force TS to treat the value of name as a  key of the ProductData
		setProductData((prevData) => ({
			...prevData,
			[key]: key === "price" || key === "countInStock" ? Number(value) : value,
		}));
	};
	const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
		// because we are dealing with files, we need async
		const file = e.target.files?.[0];
		if (!file) return;

		const formData = new FormData();
		formData.append("image", file);
		try {
			setUploading(true);
			const { data } = await axios.post(`${API_URL}/api/upload`, formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			setProductData((prevData) => ({
				...prevData,
				images: [...prevData.images, { url: data.imageUrl, altText: "" }],
			}));
			setUploading(false);
		} catch (error) {
			console.error(error);
		} finally {
			setUploading(false);
		}
	};
	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!id) return;

		// mapping colors field to options
		const { color, ...rest } = productData;
		const productUpdatePayload: Partial<Product> = {
			...rest,
			options: {
				...(selectedProduct?.options ?? {}),
				...(color.length ? { color } : {}),
			},
		};

		dispatch(updateProduct({ id, productData: productUpdatePayload }));
		navigate("/admin/products");
	};
	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error}</p>;
	return (
		<div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
			<h2 className="text-3xl font-bold mb-6">Edit Product</h2>
			<form onSubmit={handleSubmit}>
				{/* Name */}
				<div className="mb-6">
					<label className="block font-semibold mb-2">Product Name</label>
					<input
						type="text"
						name="name"
						value={productData.name}
						onChange={handleChange}
						className="w-full border border-gray-300 rounded-md p-2"
						required
					/>
				</div>
				{/* Description */}
				<div className="mb-6">
					<label className="block font-semibold mb-2">Description</label>
					<textarea
						name="description"
						value={productData.description}
						onChange={handleChange}
						className="w-full border border-gray-300 rounded-md p-2"
						rows={4}
						required
					></textarea>
				</div>

				{/* Price */}
				<div className="mb-6">
					<label className="block font-semibold mb-2">Price</label>
					<input
						type="number"
						name="price"
						value={productData.price}
						onChange={handleChange}
						className="w-full border border-gray-300 rounded-md p-2"
					/>
				</div>

				{/* Count in Stock */}
				<div className="mb-6">
					<label className="block font-semibold mb-2">Count in Stock</label>
					<input
						type="number"
						name="countInStock"
						value={productData.countInStock}
						onChange={handleChange}
						className="w-full border border-gray-300 rounded-md p-2"
					/>
				</div>

				{/* SKU */}
				<div className="mb-6">
					<label className="block font-semibold mb-2">SKU</label>
					<input
						type="text"
						name="sku"
						value={productData.sku}
						onChange={handleChange}
						className="w-full border border-gray-300 rounded-md p-2"
					/>
				</div>

				{/* Colors */}
				<div className="mb-6">
					<label className="block font-semibold mb-2">
						Colors (comma-separated)
					</label>
					<input
						type="text"
						name="colors"
						value={productData.color.join(", ")}
						// need to find fix for this field because right now user cannot type , or SPACE
						onChange={(e) => {
							const color = e.target.value
								.split(",")
								.map((color) => color.trim())
								.filter((color) => color.length > 0);
							setProductData((prev) => ({
								...prev,
								color,
							}));
						}}
						className="w-full border border-gray-300 rounded-md p-2"
					/>
				</div>
				{/* Materials */}
				<div className="mb-6">
					<label className="block font-semibold mb-2">Material</label>
					<input
						type="text"
						name="material"
						value={productData.material}
						onChange={handleChange}
						className="w-full border border-gray-300 rounded-md p-2"
					/>
				</div>
				{/* Image upload */}
				<div className="mb-8">
					<label className="block font-semibold mb-2">Upload Image</label>
					<input
						type="file"
						onChange={handleImageUpload}
						className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-white hover:file:bg-gray-700 cursor-pointer"
					/>
					{uploading && <p>Uploading image...</p>}
					<div className="flex gap-4 mt-4">
						{productData.images.map((image, index) => (
							<div key={index}>
								<img
									src={image.url}
									alt={image.altText || "Product Image"}
									className="w-20 h-20 object-cover rounded-md shadow-md"
								/>
							</div>
						))}
					</div>
				</div>
				<button
					type="submit"
					className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors"
				>
					Update Product
				</button>
			</form>
		</div>
	);
};

export default EditProductPage;
