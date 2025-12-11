import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import type { Order } from "../../types/order";
import type { AppError } from "../../types/error";
import { API_URL, getAuthHeader } from "../../constants/api";

interface OrdersState {
	orders: Order[];
	// may need totalOrders: 0??
	orderDetails: Order | null;
	loading: boolean;
	error: string | null;
}

const initialState: OrdersState = {
	orders: [],
	orderDetails: null,
	loading: false,
	error: null,
};

// async thunk to fetch user orders
export const fetchUserOrders = createAsyncThunk<
	Order[],
	void,
	{ rejectValue: AppError }
>("orders/fetchUserOrders", async (_, { rejectWithValue }) => {
	try {
		const response = await axios.get(`${API_URL}/api/orders/my-orders`, {
			headers: getAuthHeader(),
		});
		return response.data;
	} catch (err) {
		const error = err as AxiosError<AppError>;
		if (error.response && error.response.data) {
			return rejectWithValue(error.response.data);
		}
		return rejectWithValue({ message: "Failed to fetch orders" });
	}
});

// async thunk to fetch order details by ID
export const fetchOrderDetails = createAsyncThunk<
	Order,
	{ orderId: string },
	{ rejectValue: AppError }
>("orders/fetchOrderDetails", async (orderId, { rejectWithValue }) => {
	try {
		const response = await axios.get(`${API_URL}/api/orders/${orderId}`, {
			headers: getAuthHeader(),
		});
		return response.data;
	} catch (err) {
		const error = err as AxiosError<AppError>;
		if (error.response && error.response.data) {
			return rejectWithValue(error.response.data);
		}
		return rejectWithValue({ message: "Failed to fetch order details" });
	}
});

const orderSlice = createSlice({
	name: "orders",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchUserOrders.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchUserOrders.fulfilled, (state, action) => {
				state.loading = false;
				state.orders = action.payload;
			})
			.addCase(fetchUserOrders.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload?.message || "Failed to fetch orders";
			})
			.addCase(fetchOrderDetails.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchOrderDetails.fulfilled, (state, action) => {
				state.loading = false;
				state.orderDetails = action.payload;
			})
			.addCase(fetchOrderDetails.rejected, (state, action) => {
				state.loading = false;
				state.error =
					action.payload?.message || "Failed to fetch order details";
			});
	},
});

export default orderSlice.reducer;
