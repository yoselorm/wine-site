import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/Api';
import { api_url } from '../utils/config';

// GET /v1/food-dishes — nested pagination shape (data.data + data.meta)
export const fetchFoodDishes = createAsyncThunk(
  'foodPairing/fetchFoodDishes',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(`${api_url}/v1/food-dishes`, { params });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch food dishes');
    }
  }
);

// GET /v1/food-dishes/{dish_id}/pairings — { data: { dish, pairings: { data, meta } } }
export const fetchDishPairings = createAsyncThunk(
  'foodPairing/fetchDishPairings',
  async ({ dishId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await api.get(`${api_url}/v1/food-dishes/${dishId}/pairings`, { params });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch pairings for this dish');
    }
  }
);

const foodPairingSlice = createSlice({
  name: 'foodPairing',
  initialState: {
    dishes: [],
    dishesMeta: null,
    dishesLoading: false,
    dishesError: null,

    selectedDish: null,
    pairings: [],
    pairingsMeta: null,
    pairingsLoading: false,
    pairingsError: null,
  },
  reducers: {
    clearSelectedDish: (state) => {
      state.selectedDish = null;
      state.pairings = [];
      state.pairingsMeta = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFoodDishes.pending, (state) => {
        state.dishesLoading = true;
        state.dishesError = null;
      })
      .addCase(fetchFoodDishes.fulfilled, (state, action) => {
        state.dishesLoading = false;
        const payload = action.payload?.data;
        // Real numbered pagination — each page replaces the list, it doesn't append to it.
        state.dishes = Array.isArray(payload) ? payload : payload?.data || [];
        state.dishesMeta = Array.isArray(payload) ? null : payload?.meta || null;
      })
      .addCase(fetchFoodDishes.rejected, (state, action) => {
        state.dishesLoading = false;
        state.dishesError = action.payload;
      })

      .addCase(fetchDishPairings.pending, (state) => {
        state.pairingsLoading = true;
        state.pairingsError = null;
      })
      .addCase(fetchDishPairings.fulfilled, (state, action) => {
        state.pairingsLoading = false;
        state.selectedDish = action.payload?.data?.dish || null;
        const pairingsPayload = action.payload?.data?.pairings;
        const list = Array.isArray(pairingsPayload) ? pairingsPayload : pairingsPayload?.data || [];
        const page = Number(action.meta.arg?.params?.page) || 1;
        state.pairings = page > 1 ? [...state.pairings, ...list] : list;
        state.pairingsMeta = Array.isArray(pairingsPayload) ? null : pairingsPayload?.meta || null;
      })
      .addCase(fetchDishPairings.rejected, (state, action) => {
        state.pairingsLoading = false;
        state.pairingsError = action.payload;
      });
  },
});

export const { clearSelectedDish } = foodPairingSlice.actions;
export default foodPairingSlice.reducer;
