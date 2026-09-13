import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/Api';
import { api_url } from '../utils/config';

// GET /v1/pickup-locations — public, unpaginated, active-only reference data
export const fetchPickupLocations = createAsyncThunk(
  'pickupLocations/fetchPickupLocations',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(`${api_url}/v1/pickup-locations`, { params });
      const payload = response.data?.data;
      return Array.isArray(payload) ? payload : payload?.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch pickup locations');
    }
  }
);

const pickupLocationSlice = createSlice({
  name: 'pickupLocations',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPickupLocations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPickupLocations.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPickupLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default pickupLocationSlice.reducer;
