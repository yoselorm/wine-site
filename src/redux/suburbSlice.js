import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/Api';
import { api_url } from '../utils/config';

// GET /v1/suburbs — public, unpaginated, deliverable-only reference data
export const fetchSuburbs = createAsyncThunk(
  'suburbs/fetchSuburbs',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(`${api_url}/v1/suburbs`, { params });
      const payload = response.data?.data;
      return Array.isArray(payload) ? payload : payload?.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch suburbs');
    }
  }
);

const suburbSlice = createSlice({
  name: 'suburbs',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuburbs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuburbs.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchSuburbs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default suburbSlice.reducer;
