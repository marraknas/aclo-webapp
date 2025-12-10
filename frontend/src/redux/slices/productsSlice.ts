import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { Product } from "../../types/products";

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

// async thunk to fetch products by collection
export const fetchProducts = createAsyncThunk<Product[]>("products/fetchAll", async () => {
	const response = await axios.get<Product[]>(
		`${import.meta.env.VITE_BACKEND_URL as string}/api/products`
	);
	return response.data;
});

// async thunk to fetch a single product by ID
export const fetchProductDetails = createAsyncThunk<
		Product, // return type
		{id: string} // args
	>(
	"products/fetchProductDetails",
	async ({ id }) => {
		const response = await axios.get<Product>(
			`${import.meta.env.VITE_BACKEND_URL as string}/api/products/${id}`
		);
		return response.data;
	}
);

// async thunk to update products
export const updateProduct = createAsyncThunk<Product, {id: string, productData: Partial<Product>}>(
	"products/updateProduct",
	async ({ id, productData }) => {
		const response = await axios.put<Product>(
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
export const fetchSimilarProducts = createAsyncThunk<Product[], {id: string}>(
	"products/fetchSimilarProducts",
	async ({ id }) => {
		const response = await axios.get<Product[]>(
			`${import.meta.env.VITE_BACKEND_URL as string}/api/products/similar/${id}`
		);
		return response.data;
	}
);

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
			.addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
				state.loading = false;
				state.products = Array.isArray(action.payload) ? action.payload : [];
			})
			.addCase(fetchProducts.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message ?? null;
			})
			// FETCH DETAILS
			.addCase(fetchProductDetails.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchProductDetails.fulfilled, (state, action: PayloadAction<Product>) => {
				state.loading = false;
				state.selectedProduct = action.payload;
			})
			.addCase(fetchProductDetails.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message ?? null;
			})
			// UPDATE PRODUCT
			.addCase(updateProduct.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
				state.loading = false;
				const updatedProduct = action.payload;
				const index = state.products.findIndex((product) => product._id === updatedProduct._id)
				if (index !== -1) {
					state.products[index] = updatedProduct;
				}
			})
			.addCase(updateProduct.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message ?? null;
			})
			// SIMILAR PRODUCTS
			.addCase(fetchSimilarProducts.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchSimilarProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
				state.loading = false;
				state.products = action.payload;
			})
			.addCase(fetchSimilarProducts.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message ?? null;
			});
	},
});

export default productSlice.reducer;
