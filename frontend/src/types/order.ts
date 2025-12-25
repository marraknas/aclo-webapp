export interface OrderItem {
	productId: string;
	productVariantId: string;
	name: string;
	image: string;
	price: number;
	options: Record<string, any>;
	quantity: number;
}

export interface ShippingDetails {
	name: string;
	address: string;
	city: string;
	postalCode: string;
	phone: string;
}

export interface Order {
	_id: string;
	user: string | { name: string; email: string };
	orderItems: OrderItem[];
	shippingDetails: ShippingDetails;
	paymentMethod: string;
	totalPrice: number;
	isPaid: boolean;
	paidAt?: string;
	isDelivered: boolean;
	deliveredAt?: string;
	paymentStatus: string;
	paymentDetails?: any;
	status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
	createdAt: string;
	updatedAt: string;
}
