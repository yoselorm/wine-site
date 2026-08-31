import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/Api';
import { api_url } from '../utils/config';

// GET /api/v1/addresses — list saved addresses
export const fetchAddresses = createAsyncThunk(
  'addresses/fetchAddresses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${api_url}/v1/addresses`);
      return response.data?.data || response.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch addresses');
    }
  }
);

// POST /api/v1/addresses — create a new address
export const addAddress = createAsyncThunk(
  'addresses/addAddress',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post(`${api_url}/v1/addresses`, payload);
      return response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to save address');
    }
  }
);

// PUT /api/v1/addresses/{id} — update an existing address
export const updateAddress = createAsyncThunk(
  'addresses/updateAddress',
  async ({ id, ...payload }, { rejectWithValue }) => {
    try {
      const response = await api.put(`${api_url}/v1/addresses/${id}`, payload);
      return response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update address');
    }
  }
);

// DELETE /api/v1/addresses/{id} — remove an address
export const deleteAddress = createAsyncThunk(
  'addresses/deleteAddress',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`${api_url}/v1/addresses/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete address');
    }
  }
);

const addressSlice = createSlice({
  name: 'addresses',
  initialState: {
    items: [],
    loading: false,
    saving: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addAddress.pending, (state) => {
        state.saving = true;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.saving = false;
        if (action.payload) state.items.push(action.payload);
      })
      .addCase(addAddress.rejected, (state) => {
        state.saving = false;
      })

      .addCase(updateAddress.pending, (state) => {
        state.saving = true;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.saving = false;
        const updated = action.payload;
        if (updated) {
          const idx = state.items.findIndex((a) => a.id === updated.id);
          if (idx !== -1) state.items[idx] = updated;
        }
      })
      .addCase(updateAddress.rejected, (state) => {
        state.saving = false;
      })

      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.items = state.items.filter((a) => a.id !== action.payload);
      });
  },
});

export default addressSlice.reducer;
