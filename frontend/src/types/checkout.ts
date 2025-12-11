export interface CheckoutItem {
	productId: string;
	name: string;
	image: string;
	price: number;
	options?: Record<string, any>;
	quantity: number;
}

export interface ShippingDetails {
	name: string;
	address: string;
	city: string;
	postalCode: string;
	phone: string;
}

export interface Checkout {
	_id: string;
	user: string; // userId
	checkoutItems: CheckoutItem[];
	shippingDetails: ShippingDetails;
	paymentMethod: string;
	totalPrice: number;
	isPaid: boolean;
	paidAt?: string;
	paymentStatus: string;
	paymentDetails?: Record<string, any>;
	isFinalized: boolean;
	finalizedAt?: string;
	createdAt: string;
	updatedAt: string;
}

// Payload when calling createCheckout
export interface CreateCheckoutPayload {
	checkoutItems: CheckoutItem[];
	shippingDetails: ShippingDetails;
	paymentMethod: string;
	totalPrice: number;
}
