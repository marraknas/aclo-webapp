import type { PaymentProof } from "./checkout";

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

export interface CancelRequest {
  reason: string;
  createdAt: string;
}

export interface Order {
  _id: string;
  checkout: string; // checkoutId
  user: string | { name: string; email: string };
  orderItems: OrderItem[];
  shippingDetails: ShippingDetails;
  paymentMethod: string;
  paymentProof?: PaymentProof;
  noteToSeller?: string;
  cancelRequest?: CancelRequest;
  adminRemarks?: string;
  shippingCost?: number;
  shippingMethod?: string;
  shippingCourier?: string;
  shippingDuration?: string;
  totalPrice: number;
  isPaid: boolean; // not used until midtrans
  paidAt?: string;
  deliveredAt?: string;
  paymentDetails?: any;
  status:
    | "pending"
    | "processing"
    | "shipping"
    | "cancelling"
    | "rejected"
    | "delivered"
    | "cancelled"
    | "returned"
    | "refunded"
    | "exchanged";
  createdAt: string;
  updatedAt: string;
}
