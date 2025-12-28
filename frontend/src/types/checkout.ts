export interface CheckoutItem {
  productId: string;
  productVariantId: string;
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
  shippingCost?: number;
  shippingMethod?: string;
  shippingCourier?: string;
  shippingDuration?: string;
  isFinalized: boolean;
  finalizedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingOption {
  courier_name: string;
  courier_code: string;
  courier_service_name: string;
  courier_service_code: string;
  description: string;
  duration: string;
  price: number;
  type: string;
}

export interface ShippingCostRequest {
  destinationPostalCode: string;
  cartItems: Array<{
    productId: string;
    price: number;
    quantity: number;
  }>;
}

export interface ShippingCostResponse {
  success: boolean;
  options: ShippingOption[];
  origin?: any;
  destination?: any;
}

// Payload when calling createCheckout
export interface CreateCheckoutPayload {
  checkoutItems: CheckoutItem[];
  shippingDetails: ShippingDetails;
  paymentMethod: string;
  totalPrice: number;
  shippingCost?: number;
  shippingMethod?: string;
  shippingCourier?: string;
  shippingDuration?: string;
}
