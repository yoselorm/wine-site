import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/Api';
import { api_url } from '../utils/config';

// GET /api/v1/wallet — balance + transaction history
export const fetchWallet = createAsyncThunk(
  'wallet/fetchWallet',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${api_url}/v1/wallet`);
      return response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch wallet');
    }
  }
);

const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    balance: 0,
    currency: 'GHS',
    transactions: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWallet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWallet.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload?.balance ?? 0;
        state.currency = action.payload?.currency || 'GHS';
        state.transactions = action.payload?.transactions || [];
      })
      .addCase(fetchWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default walletSlice.reducer;
