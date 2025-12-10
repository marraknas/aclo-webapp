import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

// async thunk to fetch products by collection
export const fetchProducts = createAsyncThunk("products/fetchAll", async () => {
	const response = await axios.get(
		`${import.meta.env.VITE_BACKEND_URL as string}/api/products`
	);
	return response.data;
});

// async thunk to fetch a single product by ID
export const fetchProductDetails = createAsyncThunk(
	"products/fetchProductDetails",
	async ({ id }) => {
		const response = await axios.get(
			`${import.meta.env.VITE_BACKEND_URL as string}/api/products/${id}`
		);
		return response.data;
	}
);

// async thunk to update products
export const updateProduct = createAsyncThunk(
	"products/updateProduct",
	async ({ id, productData }) => {
		const response = await axios.put(
			`${import.meta.env.VITE_BACKEND_URL as string}/api/products/${id}`,
			productData,
			{
				headers: {
					Authorization: `Bearer ${localStorage.getItem("userToken")}`,
				},
			}
		);
		return response.data;
	}
);

// async thunk to fetch similar products
export const fetchSimilarProducts = createAsyncThunk(
	"products/fetchSimilarProducts",
	async ({ id }) => {
		const response = await axios.get(
			`${import.meta.env.VITE_BACKEND_URL as string}/api/products/similar/${id}`
		);
		return response.data;
	}
);

const productSlice = createSlice({
	name: "products",
	initialState: {
		products: [],
		selectedProduct: null,
		similarProducts: [],
		loading: false,
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchProducts.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchProducts.fulfilled, (state, action) => {
				state.loading = false;
				state.products = Array.isArray(action.payload) ? action.payload : [];
			})
			.addCase(fetchProducts.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			})
			.addCase(fetchProductDetails.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchProductDetails.fulfilled, (state, action) => {
				state.loading = true;
				state.selectedProduct = action.payload;
			})
			.addCase(fetchProductDetails.rejected, (state, action) => {
				state.loading = true;
				state.error = action.error.message;
			})
			.addCase(updateProduct.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateProduct.fulfilled, (state, action) => {
				state.loading = true;
				state.selectedProduct = action.payload;
			})
			.addCase(updateProduct.rejected, (state, action) => {
				state.loading = true;
				state.error = action.error.message;
			});
	},
});
