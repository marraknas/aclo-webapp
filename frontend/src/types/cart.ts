export interface CartItem {
  productId: string; // ObjectId as string
  name: string;
  image: string;
  price: number;
  options?: Record<string, any>; // flexible object for options
  quantity: number;
}

export interface Cart {
  user?: string; // ObjectId of user
  guestId?: string;
  products: CartItem[];
  totalPrice: number;
  createdAt?: string;
  updatedAt?: string;
}
