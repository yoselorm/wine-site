// src/redux/tasteProfileSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/Api';
import { api_url } from '../utils/config';

export const fetchTasteProfile = createAsyncThunk(
  'tasteProfile/fetchTasteProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${api_url}/v1/user/taste-profile`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch taste profile');
    }
  }
);

export const saveTasteProfile = createAsyncThunk(
  'tasteProfile/saveTasteProfile',
  async ({ preferences, flavor_profile, dietary_restrictions, typical_budget_per_bottle, experience_level, quiz_answers }, { rejectWithValue }) => {
    try {
      const response = await api.post(`${api_url}/v1/user/taste-profile`, {
        preferences,
        flavor_profile,
        dietary_restrictions,
        typical_budget_per_bottle,
        experience_level,
        quiz_answers,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to save taste profile');
    }
  }
);

const extractProfile = (payload) => {
  const raw = payload?.data || payload;
  if (!raw) return null;
  // Flatten profile_data up one level so the rest of the app can read profile.preferences directly
  return {
    id: raw.id,
    ...raw.profile_data,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
  };
};

// Add near the bottom, after extractProfile
export const isTasteProfileComplete = (profile) => {
  if (!profile) return false;
  const hasWineColor = profile.preferences?.wine_color?.length > 0;
  const hasTannin = !!profile.preferences?.tannin_tolerance;
  const hasAcidity = !!profile.preferences?.acidity_preference;
  const hasSweetness = !!profile.preferences?.sweetness_tolerance;
  const hasExperience = !!profile.experience_level;
  const hasBudget = profile.typical_budget_per_bottle?.min != null && profile.typical_budget_per_bottle?.max != null;

  return hasWineColor && hasTannin && hasAcidity && hasSweetness && hasExperience && hasBudget;
};

const tasteProfileSlice = createSlice({
  name: 'tasteProfile',
  initialState: {
    profile: null,
    loading: false,
    saving: false,
    error: null,
    saveError: null,
  },
  reducers: {
    clearTasteProfileError: (state) => {
      state.error = null;
      state.saveError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasteProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasteProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = extractProfile(action.payload);
      })
      .addCase(fetchTasteProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(saveTasteProfile.pending, (state) => {
        state.saving = true;
        state.saveError = null;
      })
      .addCase(saveTasteProfile.fulfilled, (state, action) => {
        state.saving = false;
        state.profile = extractProfile(action.payload) || state.profile;
      })
      .addCase(saveTasteProfile.rejected, (state, action) => {
        state.saving = false;
        state.saveError = action.payload;
      });
  },
});

export const selectIsTasteProfileComplete = (state) => isTasteProfileComplete(state.tasteProfile.profile);
export const { clearTasteProfileError } = tasteProfileSlice.actions;
export default tasteProfileSlice.reducer;