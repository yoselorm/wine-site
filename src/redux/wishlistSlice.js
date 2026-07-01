// src/redux/wishlistSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/Api'; 
import { api_url } from '../utils/config';



export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/v1/user/wishlist`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch wishlist');
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      // Assuming the API expects { product_id: id } or similar in the body
      const response = await api.post(`${api_url}/v1/user/wishlist`, { product_id: productId });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add to wishlist');
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      await api.delete(`${api_url}/v1/user/wishlist/${productId}`);
      return productId; // Return the ID so the reducer can filter it out of the local state
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to remove from wishlist');
    }
  }
);



const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Wishlist
      .addCase(fetchWishlist.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.data || action.payload || [];
      })
      .addCase(fetchWishlist.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Add to Wishlist
      .addCase(addToWishlist.pending, (state) => { state.error = null; })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        // Optimistically add the item or replace the list based on API response structure
        // If the API returns the added item, you can push it:
        // state.items.push(action.payload.data);
      })
      .addCase(addToWishlist.rejected, (state, action) => { state.error = action.payload; })

      // Remove from Wishlist
      .addCase(removeFromWishlist.pending, (state) => { state.error = null; })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        // Remove the item from local state immediately using the ID we returned
        state.items = state.items.filter(item => item.product_id !== action.payload && item.id !== action.payload);
      })
      .addCase(removeFromWishlist.rejected, (state, action) => { state.error = action.payload; });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;