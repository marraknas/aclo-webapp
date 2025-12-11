import {
	createSlice,
	createAsyncThunk,
	type PayloadAction,
} from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import type { Product } from "../../types/products";
import type { AppError } from "../../types/error";
import { API_URL, getAuthHeader } from "../../constants/api";

interface ProductState {
	products: Product[];
	selectedProduct: Product | null;
	similarProducts: Product[];
	loading: boolean;
	error: string | null;
}

const initialState: ProductState = {
	products: [],
	selectedProduct: null,
	similarProducts: [],
	loading: false,
	error: null,
};

// async thunk to fetch products
export const fetchProducts = createAsyncThunk<
	Product[],
	void,
	{ rejectValue: AppError }
>("products/fetchAll", async (_, { rejectWithValue }) => {
	try {
		const response = await axios.get<Product[]>(
			`${API_URL as string}/api/products`
		);
		return response.data;
	} catch (err) {
		const error = err as AxiosError<AppError>;
		if (error.response && error.response.data) {
			return rejectWithValue(error.response.data);
		}
		return rejectWithValue({ message: "Failed to fetch products" });
	}
});

// async thunk to fetch a single product by ID
export const fetchProductDetails = createAsyncThunk<
	Product, // return type
	{ id: string }, // args
	{ rejectValue: AppError }
>("products/fetchProductDetails", async ({ id }, { rejectWithValue }) => {
	try {
		const response = await axios.get<Product>(
			`${API_URL as string}/api/products/${id}`
		);
		return response.data;
	} catch (err) {
		const error = err as AxiosError<AppError>;
		if (error.response && error.response.data) {
			return rejectWithValue(error.response.data);
		}
		return rejectWithValue({ message: "Failed to fetch product details" });
	}
});

// async thunk to update products
export const updateProduct = createAsyncThunk<
	Product,
	{ id: string; productData: Partial<Product> },
	{ rejectValue: AppError }
>(
	"products/updateProduct",
	async ({ id, productData }, { rejectWithValue }) => {
		try {
			const response = await axios.put<Product>(
				`${API_URL as string}/api/products/${id}`,
				productData,
				{
					headers: getAuthHeader(),
				}
			);
			return response.data;
		} catch (err) {
			const error = err as AxiosError<AppError>;
			if (error.response && error.response.data) {
				return rejectWithValue(error.response.data);
			}
			return rejectWithValue({ message: "Failed to udpate product" });
		}
	}
);

// async thunk to fetch similar products
export const fetchSimilarProducts = createAsyncThunk<
	Product[],
	{ id: string },
	{ rejectValue: AppError }
>("products/fetchSimilarProducts", async ({ id }, { rejectWithValue }) => {
	try {
		const response = await axios.get<Product[]>(
			`${API_URL as string}/api/products/similar/${id}`
		);
		return response.data;
	} catch (err) {
		const error = err as AxiosError<AppError>;
		if (error.response && error.response.data) {
			return rejectWithValue(error.response.data);
		}
		return rejectWithValue({ message: "Failed to fetch similar products" });
	}
});

const productSlice = createSlice({
	name: "products",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			// FETCH ALL
			.addCase(fetchProducts.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				fetchProducts.fulfilled,
				(state, action: PayloadAction<Product[]>) => {
					state.loading = false;
					state.products = Array.isArray(action.payload) ? action.payload : [];
				}
			)
			.addCase(fetchProducts.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload?.message || "Failed to fetch products";
			})
			// FETCH DETAILS
			.addCase(fetchProductDetails.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				fetchProductDetails.fulfilled,
				(state, action: PayloadAction<Product>) => {
					state.loading = false;
					state.selectedProduct = action.payload;
				}
			)
			.addCase(fetchProductDetails.rejected, (state, action) => {
				state.loading = false;
				state.error =
					action.payload?.message || "Failed to fetch product details";
			})
			// UPDATE PRODUCT
			.addCase(updateProduct.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				updateProduct.fulfilled,
				(state, action: PayloadAction<Product>) => {
					state.loading = false;
					const updatedProduct = action.payload;
					const index = state.products.findIndex(
						(product) => product._id === updatedProduct._id
					);
					if (index !== -1) {
						state.products[index] = updatedProduct;
					}
				}
			)
			.addCase(updateProduct.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload?.message || "Failed to update product";
			})
			// SIMILAR PRODUCTS
			.addCase(fetchSimilarProducts.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				fetchSimilarProducts.fulfilled,
				(state, action: PayloadAction<Product[]>) => {
					state.loading = false;
					state.similarProducts = action.payload;
				}
			)
			.addCase(fetchSimilarProducts.rejected, (state, action) => {
				state.loading = false;
				state.error =
					action.payload?.message || "Failed to fetch similar products";
			});
	},
});

export default productSlice.reducer;
