import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axios, {AxiosError} from "axios";
import type { Checkout, CreateCheckoutPayload } from "../../types/checkout";
import type { AppError } from "../../types/error";

interface CheckoutState {
    checkout: Checkout | null;
    loading: boolean;
    error: string | null;
}

const initialState: CheckoutState = {
    checkout: null,
    loading: false,
    error: null
}

// Async thunk to create a checkout session
export const createCheckout = createAsyncThunk<Checkout, CreateCheckoutPayload, {rejectValue: AppError}>("checkout/createCheckout", async(checkoutData, {rejectWithValue}) => {
    try {
        const response = await axios.post<Checkout>(`${import.meta.env.VITE_BACKEND_URL}/api/checkout`, checkoutData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
        })
        return response.data;
    } catch (err) {
        const error = err as AxiosError<AppError>;
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        }
        return rejectWithValue({ message: "Failed to create checkout" });
    }
})

const checkoutSlice = createSlice({
    name: "checkout",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(createCheckout.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(createCheckout.fulfilled, (state, action: PayloadAction<Checkout>) => {
            state.loading = false;
            state.checkout = action.payload;
        })
        .addCase(createCheckout.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Failed to create checkout";
        })
    }
})

export default checkoutSlice.reducer;