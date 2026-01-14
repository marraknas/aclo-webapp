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
  ShippingDetails,
  ShippingOption,
} from "../../types/checkout";
import type { AppError } from "../../types/error";
import { API_URL, getAuthHeader } from "../../constants/api";

// Helper function to load shipping details from localStorage
const loadShippingDetailsFromStorage = (): ShippingDetails | null => {
  const storedShippingDetails = localStorage.getItem("shippingDetails");
  return storedShippingDetails
    ? (JSON.parse(storedShippingDetails) as ShippingDetails)
    : null;
};

const loadSelectedShippingFromStorage = (): ShippingOption | null => {
  const storedSelectedShipping = localStorage.getItem("selectedShipping");
  return storedSelectedShipping
    ? (JSON.parse(storedSelectedShipping) as ShippingOption)
    : null;
};

const loadShippingOptionsFromStorage = (): ShippingOption[] => {
  const storedShippingOptions = localStorage.getItem("shippingOptions");
  return storedShippingOptions
    ? (JSON.parse(storedShippingOptions) as ShippingOption[])
    : [];
};

interface CheckoutState {
  checkout: Checkout | null;
  loading: boolean;
  error: string | null;
  shippingOptions: ShippingOption[];
  selectedShipping: ShippingOption | null;
  shippingLoading: boolean;
  shippingError: string | null;
  shippingDetails: ShippingDetails | null;
}

const initialState: CheckoutState = {
  checkout: null,
  loading: false,
  error: null,
  shippingOptions: loadShippingOptionsFromStorage(),
  selectedShipping: loadSelectedShippingFromStorage(),
  shippingLoading: false,
  shippingError: null,
  shippingDetails: loadShippingDetailsFromStorage(),
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
      localStorage.setItem("selectedShipping", JSON.stringify(action.payload));
    },
    setShippingDetails: (state, action: PayloadAction<ShippingDetails>) => {
      state.shippingDetails = action.payload;
      localStorage.setItem("shippingDetails", JSON.stringify(action.payload));
    },
    clearShipping: (state) => {
      state.shippingOptions = [];
      state.selectedShipping = null;
      state.shippingError = null;
      state.shippingDetails = null;
      localStorage.removeItem("shippingOptions");
      localStorage.removeItem("selectedShipping");
      localStorage.removeItem("shippingDetails");
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
          localStorage.setItem("shippingOptions", JSON.stringify(action.payload.options));
          
          const prev = state.selectedShipping;
          state.selectedShipping = (prev && action.payload.options.find(
            opt => opt.courierCode === prev.courierCode && 
                   opt.courierServiceName === prev.courierServiceName
          )) || action.payload.options[0] || null;
          
          if (state.selectedShipping) {
            localStorage.setItem("selectedShipping", JSON.stringify(state.selectedShipping));
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

export const { setSelectedShipping, setShippingDetails, clearShipping } = checkoutSlice.actions;
export default checkoutSlice.reducer;
