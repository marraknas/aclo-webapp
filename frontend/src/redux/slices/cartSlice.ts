import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import type { Cart } from "../../types/cart";
import type { User } from "../../types/user";
import type { AppError } from "../../types/error";
import { API_URL, getAuthHeader } from "../../constants/api";

interface CartState {
	cart: Cart;
	loading: boolean;
	error: string | null;
}

// helper function to load cart from localStorage
const loadCartFromStorage = (): Cart => {
	const storedCart = localStorage.getItem("cart");
	return storedCart
		? (JSON.parse(storedCart) as Cart)
		: { products: [], totalPrice: 0 };
};

const initialState: CartState = {
	cart: loadCartFromStorage(),
	loading: false,
	error: null,
};

// helper function to save cart to localStorage
const saveCartToStorage = (cart: Cart): void => {
	localStorage.setItem("cart", JSON.stringify(cart));
};

// Fetch cart for a user/guest
export const fetchCart = createAsyncThunk<
	Cart,
	{ userId?: string; guestId?: string },
	{ rejectValue: AppError }
>("cart/fetchCart", async ({ userId, guestId }, { rejectWithValue }) => {
	try {
		const response = await axios.get(`${API_URL}/api/cart`, {
			params: { userId, guestId },
		});
		return response.data;
	} catch (err) {
		const error = err as AxiosError<AppError>;
		if (error.response && error.response.data) {
			return rejectWithValue(error.response.data);
		}
		return rejectWithValue({ message: "Failed to fetch cart" });
	}
});

// Add an item to the cart for a user/guest
export const addToCart = createAsyncThunk<
	Cart,
	{
		productId: string;
		quantity: number;
		options?: Record<string, any>;
		guestId?: string;
		userId?: string;
	},
	{ rejectValue: AppError }
>(
	"cart/addToCart",
	async (
		{ productId, quantity, options, guestId, userId },
		{ rejectWithValue }
	) => {
		try {
			const response = await axios.post<Cart>(`${API_URL}/api/cart`, {
				productId,
				quantity,
				options,
				guestId,
				userId,
			});
			return response.data;
		} catch (err) {
			const error = err as AxiosError<AppError>;
			if (error.response && error.response.data) {
				return rejectWithValue(error.response.data);
			}
			return rejectWithValue({ message: "Failed to add to cart" });
		}
	}
);

// update the quantity of an item in the cart
export const updateCartItemQuantity = createAsyncThunk<
	Cart,
	{
		productId: string;
		quantity: number;
		options?: Record<string, any>;
		guestId?: string;
		userId?: string;
	},
	{ rejectValue: AppError }
>(
	"cart/updateCartItemQuantity",
	async (
		{ productId, quantity, options, guestId, userId },
		{ rejectWithValue }
	) => {
		try {
			const response = await axios.put<Cart>(`${API_URL}/api/cart`, {
				productId,
				quantity,
				options,
				guestId,
				userId,
			});
			return response.data;
		} catch (err) {
			const error = err as AxiosError<AppError>;
			if (error.response && error.response.data) {
				return rejectWithValue(error.response.data);
			}
			return rejectWithValue({ message: "Failed to update item quantity" });
		}
	}
);

// Remove an item from the cart
export const removeFromCart = createAsyncThunk<
	Cart,
	{
		productId: string;
		options?: Record<string, any>;
		guestId?: string;
		userId?: string;
	},
	{ rejectValue: AppError }
>(
	"cart/removeFromCart",
	async ({ productId, options, guestId, userId }, { rejectWithValue }) => {
		try {
			// diff syntax because DELETE method in axios treats 2nd argument as options, not as req body
			const response = await axios.delete<Cart>(`${API_URL}/api/cart`, {
				data: { productId, options, guestId, userId },
			});
			return response.data;
		} catch (err) {
			const error = err as AxiosError<AppError>;
			if (error.response && error.response.data) {
				return rejectWithValue(error.response.data);
			}
			return rejectWithValue({ message: "Failed to remove item" });
		}
	}
);

// Merge guest cart into user cart
export const mergeCart = createAsyncThunk<
	Cart,
	{ guestId: string; user: User },
	{ rejectValue: AppError }
>("cart/mergeCart", async ({ guestId, user }, { rejectWithValue }) => {
	try {
		const response = await axios.post(
			`${API_URL}/api/cart/merge`,
			{ guestId, user },
			{
				headers: getAuthHeader(),
			}
		);
		return response.data as Cart;
	} catch (err) {
		const error = err as AxiosError<AppError>;
		if (error.response && error.response.data) {
			return rejectWithValue(error.response.data);
		}
		return rejectWithValue({ message: "Failed to merge cart" });
	}
});

const cartSlice = createSlice({
	name: "cart",
	initialState,
	reducers: {
		clearCart: (state) => {
			state.cart = { products: [], totalPrice: 0 };
			localStorage.removeItem("cart");
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchCart.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchCart.fulfilled, (state, action) => {
				state.loading = false;
				state.cart = action.payload;
				saveCartToStorage(action.payload);
			})
			.addCase(fetchCart.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload?.message || "Failed to fetch cart";
			})
			.addCase(addToCart.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(addToCart.fulfilled, (state, action) => {
				state.loading = false;
				state.cart = action.payload;
				saveCartToStorage(action.payload);
			})
			.addCase(addToCart.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload?.message || "Failed to add to cart";
			})
			.addCase(updateCartItemQuantity.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateCartItemQuantity.fulfilled, (state, action) => {
				state.loading = false;
				state.cart = action.payload;
				saveCartToStorage(action.payload);
			})
			.addCase(updateCartItemQuantity.rejected, (state, action) => {
				state.loading = false;
				state.error =
					action.payload?.message || "Failed to update item quantity";
			})
			.addCase(removeFromCart.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(removeFromCart.fulfilled, (state, action) => {
				state.loading = false;
				state.cart = action.payload;
				saveCartToStorage(action.payload);
			})
			.addCase(removeFromCart.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload?.message || "Failed to remove item";
			})
			.addCase(mergeCart.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(mergeCart.fulfilled, (state, action) => {
				state.loading = false;
				state.cart = action.payload;
				saveCartToStorage(action.payload);
			})
			.addCase(mergeCart.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload?.message || "Failed to merge cart";
			});
	},
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
