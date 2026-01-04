import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import type {
  Checkout,
  CreateCheckoutPayload,
  ShippingCostRequest,
  ShippingCostResponse,
  ShippingOption,
} from "../../types/checkout";
import type { AppError } from "../../types/error";
import { API_URL, getAuthHeader } from "../../constants/api";

interface CheckoutState {
  checkout: Checkout | null;
  loading: boolean;
  error: string | null;
  shippingOptions: ShippingOption[];
  selectedShipping: ShippingOption | null;
  shippingLoading: boolean;
  shippingError: string | null;
}

const initialState: CheckoutState = {
  checkout: null,
  loading: false,
  error: null,
  shippingOptions: [],
  selectedShipping: null,
  shippingLoading: false,
  shippingError: null,
};

// Async thunk to fetch checkout by Id
export const fetchCheckoutById = createAsyncThunk<
  Checkout,
  { checkoutId: string },
  { rejectValue: AppError }
>("checkout/fetchCheckoutById", async ({ checkoutId }, { rejectWithValue }) => {
  try {
    const res = await axios.get<Checkout>(
      `${API_URL}/api/checkout/${checkoutId}`,
      {
        headers: getAuthHeader(),
      }
    );
    return res.data;
  } catch (err) {
    const error = err as AxiosError<AppError>;
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue({ message: "Failed to fetch checkout" });
  }
});

// Async thunk to create a checkout session
export const createCheckout = createAsyncThunk<
  Checkout,
  CreateCheckoutPayload,
  { rejectValue: AppError }
>("checkout/createCheckout", async (checkoutData, { rejectWithValue }) => {
  try {
    const response = await axios.post<Checkout>(
      `${API_URL}/api/checkout`,
      checkoutData,
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
    return rejectWithValue({ message: "Failed to create checkout" });
  }
});

// Async thunk to calculate shipping cost
export const calculateShippingCost = createAsyncThunk<
  ShippingCostResponse,
  ShippingCostRequest,
  { rejectValue: AppError }
>("checkout/calculateShippingCost", async (request, { rejectWithValue }) => {
  try {
    const response = await axios.post<ShippingCostResponse>(
      `${API_URL}/api/calculate-shipping`,
      request,
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
    return rejectWithValue({ message: "Failed to calculate shipping cost" });
  }
});

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setSelectedShipping: (state, action: PayloadAction<ShippingOption>) => {
      state.selectedShipping = action.payload;
    },
    clearShipping: (state) => {
      state.shippingOptions = [];
      state.selectedShipping = null;
      state.shippingError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCheckoutById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCheckoutById.fulfilled,
        (state, action: PayloadAction<Checkout>) => {
          state.loading = false;
          state.checkout = action.payload;
        }
      )
      .addCase(fetchCheckoutById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch checkout";
      })
      .addCase(createCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createCheckout.fulfilled,
        (state, action: PayloadAction<Checkout>) => {
          state.loading = false;
          state.checkout = action.payload;
        }
      )
      .addCase(createCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create checkout";
      })

      .addCase(calculateShippingCost.pending, (state) => {
        state.shippingLoading = true;
        state.shippingError = null;
      })
      .addCase(
        calculateShippingCost.fulfilled,
        (state, action: PayloadAction<ShippingCostResponse>) => {
          state.shippingLoading = false;
          state.shippingOptions = action.payload.options;
          // auto-select the first shipping option
          if (action.payload.options.length > 0) {
            state.selectedShipping = action.payload.options[0];
          }
        }
      )
      .addCase(calculateShippingCost.rejected, (state, action) => {
        state.shippingLoading = false;
        state.shippingError =
          action.payload?.message || "Failed to calculate shipping cost";
      });
  },
});

export const { setSelectedShipping, clearShipping } = checkoutSlice.actions;
export default checkoutSlice.reducer;
