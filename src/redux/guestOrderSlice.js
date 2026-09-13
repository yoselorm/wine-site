import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/Api';
import { api_url } from '../utils/config';

// POST /v1/guest/orders — throttled 5/minute
export const createGuestOrder = createAsyncThunk(
  'guestOrder/createGuestOrder',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post(`${api_url}/v1/guest/orders`, payload);
      return response.data?.data || response.data;
    } catch (err) {
      if (err.response?.status === 429) {
        return rejectWithValue('Too many attempts — please wait a moment and try again.');
      }
      if (err.response?.status === 422 && err.response?.data?.errors) {
        return rejectWithValue(Object.values(err.response.data.errors).flat().join(' '));
      }
      return rejectWithValue(err.response?.data?.message || 'Failed to place order');
    }
  }
);

// POST /v1/guest/orders/lookup — throttled 6/minute. order_number + email is a credential,
// so this must stay a POST (never a GET with these in the query string).
export const lookupGuestOrder = createAsyncThunk(
  'guestOrder/lookupGuestOrder',
  async ({ order_number, email }, { rejectWithValue }) => {
    try {
      const response = await api.post(`${api_url}/v1/guest/orders/lookup`, { order_number, email });
      return response.data?.data || response.data;
    } catch (err) {
      if (err.response?.status === 429) {
        return rejectWithValue('Too many attempts — please wait a moment and try again.');
      }
      if (err.response?.status === 404) {
        return rejectWithValue("We couldn't find an order with that number and email.");
      }
      return rejectWithValue(err.response?.data?.message || 'Something went wrong');
    }
  }
);

const guestOrderSlice = createSlice({
  name: 'guestOrder',
  initialState: {
    placedOrder: null,
    placing: false,
    placeError: null,

    lookedUpOrder: null,
    lookingUp: false,
    lookupError: null,
  },
  reducers: {
    clearGuestOrderState: (state) => {
      state.placedOrder = null;
      state.placeError = null;
      state.lookedUpOrder = null;
      state.lookupError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createGuestOrder.pending, (state) => {
        state.placing = true;
        state.placeError = null;
      })
      .addCase(createGuestOrder.fulfilled, (state, action) => {
        state.placing = false;
        state.placedOrder = action.payload;
      })
      .addCase(createGuestOrder.rejected, (state, action) => {
        state.placing = false;
        state.placeError = action.payload;
      })

      .addCase(lookupGuestOrder.pending, (state) => {
        state.lookingUp = true;
        state.lookupError = null;
        state.lookedUpOrder = null;
      })
      .addCase(lookupGuestOrder.fulfilled, (state, action) => {
        state.lookingUp = false;
        state.lookedUpOrder = action.payload;
      })
      .addCase(lookupGuestOrder.rejected, (state, action) => {
        state.lookingUp = false;
        state.lookupError = action.payload;
      });
  },
});

export const { clearGuestOrderState } = guestOrderSlice.actions;
export default guestOrderSlice.reducer;
