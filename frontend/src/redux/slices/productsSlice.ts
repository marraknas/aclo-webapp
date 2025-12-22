import {
	createSlice,
	createAsyncThunk,
	type PayloadAction,
} from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import type { Product } from "../../types/product";
import type { ProductVariant } from "../../types/productVariant";
import type { AppError } from "../../types/error";
import { API_URL } from "../../constants/api";

interface ProductState {
	products: Product[];
	selectedProduct: Product | null;
	selectedVariant: ProductVariant | null;
	similarProducts: Product[];
	loading: boolean;
	variantLoading: boolean;
	error: string | null;
}

const initialState: ProductState = {
	products: [],
	selectedProduct: null,
	selectedVariant: null,
	similarProducts: [],
	loading: false,
	variantLoading: false,
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

// async thunk to fetch ONE product variant details
export const fetchProductVariant = createAsyncThunk<
	ProductVariant,
	{ productId: string; color?: string; variant?: string,productVariantId?: string },
	{ rejectValue: AppError }
>("products/fetchProductVariant", async (args, { rejectWithValue }) => {
	const { productId, color, variant, productVariantId } = args;

	try {
		const params = productVariantId 
            ? { productVariantId } 
            : { color, variant };
		const response = await axios.get<ProductVariant>(
			`${API_URL as string}/api/products/${productId}/variant`,
			{ params: params }
		);
		return response.data;
	} catch (err) {
		const error = err as AxiosError<AppError>;
		if (error.response && error.response.data) {
			return rejectWithValue(error.response.data);
		}
		return rejectWithValue({ message: "Failed to fetch product variant" });
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
				state.selectedVariant = null;
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
			})
			// VARIANT
			.addCase(fetchProductVariant.pending, (state) => {
				state.variantLoading = true;
				state.error = null;
			})
			.addCase(
				fetchProductVariant.fulfilled,
				(state, action: PayloadAction<ProductVariant>) => {
					state.variantLoading = false;
					state.selectedVariant = action.payload;
				}
			)
			.addCase(fetchProductVariant.rejected, (state, action) => {
				state.variantLoading = false;
				state.error =
					action.payload?.message || "Failed to fetch product variant";
			});
	},
});

export default productSlice.reducer;
