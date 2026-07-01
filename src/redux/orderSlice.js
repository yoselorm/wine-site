// src/redux/ordersSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/Api';
import { api_url } from '../utils/config';

// GET /api/v1/orders — List user orders
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${api_url}/v1/orders`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

// GET /api/v1/orders/{order} — Get order details
export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await api.get(`${api_url}/v1/orders/${orderId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch order details');
    }
  }
);

// POST /api/v1/orders — Create a new order (Checkout)
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async ({ customer_address_id, payment_token, notes, coupon_code, items }, { rejectWithValue }) => {
    try {
      const response = await api.post(`${api_url}/v1/orders`, {
        customer_address_id,
        payment_token,
        notes,
        coupon_code,
        items, // [{ product_id, variant_id, quantity }]
      });
      return response.data;
    } catch (err) {
      // Distinguish validation (422) vs processing (400) errors if you want different UI messaging
      return rejectWithValue(err.response?.data?.message || 'Checkout failed');
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    items: [],          // order history list
    selectedOrder: null, // single order detail
    loading: false,
    checkoutLoading: false,
    error: null,
    checkoutError: null,
  },
  reducers: {
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    },
    clearCheckoutError: (state) => {
      state.checkoutError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch order list
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.data || action.payload || [];
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch single order detail
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload?.data || action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create order (checkout)
      .addCase(createOrder.pending, (state) => {
        state.checkoutLoading = true;
        state.checkoutError = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.checkoutLoading = false;
        const newOrder = action.payload?.data || action.payload;
        if (newOrder) {
          state.items.unshift(newOrder); // add to top of order history
        }
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.checkoutLoading = false;
        state.checkoutError = action.payload;
      });
  },
});

export const { clearSelectedOrder, clearCheckoutError } = ordersSlice.actions;
export default ordersSlice.reducer;