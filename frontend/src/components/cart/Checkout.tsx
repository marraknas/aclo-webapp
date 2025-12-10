import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import PayPalButton from "./PayPalButton";
import type { Cart } from "../../types/cart";

// mock cart
const cart: Cart = {
	products: [
		{
			productId: "1",
			name: "T-shirt",
			options: {
				size: "M",
				color: "Red",
			},
			quantity: 1,
			price: 15000,
			image: "https://picsum.photos/200?random=1",
		},
		{
			productId: "2",
			name: "Jeans",
			options: {

				size: "L",
				color: "Blue",
			},
			quantity: 1,
			price: 15000,
			image: "https://picsum.photos/200?random=2",
		},
	],
	totalPrice: 30000,
};

const Checkout = () => {
	const navigate = useNavigate();
	const [checkoutId, setCheckoutId] = useState<string | null>(null);
	const [shippingDetails, setShippingDetails] = useState({
		name: "",
		address: "",
		city: "",
		postalCode: "",
		phone: "",
	});

	const handleCreateCheckout = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// paypal developer's account needed for this at https://developer.paypal.com/home/
		setCheckoutId("dummy-checkout-id");
	};
	const handlePaymentSuccess = (details: Record<string, unknown>) => {
		console.log("Payment Successful", details);
		navigate("/order-confirmation");
	};
	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter">
			{/* Left Section */}
			<div className="bg-white rounded-lg p-6">
				<h2 className="text-2xl uppercase mb-6">Checkout</h2>
				<form onSubmit={handleCreateCheckout}>
					<h3 className="text-lg mb-4">Contact Details</h3>
					<div className="mb-4">
						<label className="block text-gray-700">Email</label>
						<input
							type="email"
							value="user@example.com"
							className="w-full p-2 border rounded"
							disabled
						/>
					</div>
					<h3 className="text-lg mb-4">Delivery</h3>
					<div className="mb-4">
						<label className="block text-gray-700">Name</label>
						<input
							type="text"
							value={shippingDetails.name}
							onChange={(e) =>
								setShippingDetails({
									...shippingDetails,
									name: e.target.value,
								})
							}
							className="w-full p-2 border rounded"
							required
						/>
					</div>
					<div className="mb-4">
						<label className="block text-gray-700">Address</label>
						<input
							type="text"
							value={shippingDetails.address}
							onChange={(e) =>
								setShippingDetails({
									...shippingDetails,
									address: e.target.value,
								})
							}
							className="w-full p-2 border rounded"
							required
						/>
					</div>
					<div className="mb-4 grid grid-cols-2 gap-4">
						<div>
							<label className="block text-gray-700">City</label>
							<input
								type="text"
								value={shippingDetails.city}
								onChange={(e) =>
									setShippingDetails({
										...shippingDetails,
										city: e.target.value,
									})
								}
								className="w-full p-2 border rounded"
								required
							/>
						</div>
						<div>
							<label className="block text-gray-700">Postal Code</label>
							<input
								type="text"
								value={shippingDetails.postalCode}
								onChange={(e) =>
									setShippingDetails({
										...shippingDetails,
										postalCode: e.target.value,
									})
								}
								className="w-full p-2 border rounded"
								required
							/>
						</div>
					</div>
					<div className="mb-4">
						<label className="block text-gray-700">Phone</label>
						<input
							type="tel"
							value={shippingDetails.phone}
							onChange={(e) =>
								setShippingDetails({
									...shippingDetails,
									phone: e.target.value,
								})
							}
							className="w-full p-2 border rounded"
							required
						/>
					</div>
					<div className="mt-6">
						{!checkoutId ? (
							<button
								type="submit"
								className="w-full bg-black text-white py-3 rounded"
							>
								Continue to Payment
							</button>
						) : (
							<div>
								<h3 className="text-lg mb-4">Pay with Paypal</h3>
								{/* Paypal button component */}
								<PayPalButton
									amount={30000}
									onSuccess={handlePaymentSuccess}
									onError={(err) => {
										alert("Payment failed. Try again later.");
										console.log(err);
									}}
								/>
							</div>
						)}
					</div>
				</form>
			</div>
			{/* Right section */}
			<div className="bg-gray-50 p-6 rounded-lg">
				<h3 className="text-lg mb-4">Order Summary</h3>
				<div className="border-t border-gray-300 py-4 mb-4">
					{cart.products.map((product, index) => (
						<div
							key={index}
							className="flex items-start justify-between py-2 border-b border-gray-300"
						>
							<div className="flex items-start">
								<img
									src={product.image}
									alt={product.name}
									className="w-20 h-24 object-cover mr-4"
								/>
								<div>
									<h3 className="text-md">{product.name}</h3>
									<p className="text-gray-500">Size: {product.options?.size}</p>
									<p className="text-gray-500">Color: {product.options?.color}</p>
								</div>
							</div>
							<p className="text-xl">IDR {product.price?.toLocaleString()}</p>
						</div>
					))}
				</div>
				<div className="flex justify-between items-center text-lg mb-4">
					<p>Subtotal</p>
					<p>IDR {cart.totalPrice?.toLocaleString()}</p>
				</div>
				<div className="flex justify-between items-center text-lg">
					<p>Shipping</p>
					<p>Free</p>
				</div>
				<div className="flex justify-between items-center text-lg mt-4 border-t border-gray-300 pt-4">
					<p>Total</p>
					<p>IDR {cart.totalPrice?.toLocaleString()}</p>
				</div>
			</div>
		</div>
	);
};

export default Checkout;
