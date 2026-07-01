// src/redux/sommelierSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/Api';
import { api_url } from '../utils/config';

export const sendSommelierMessage = createAsyncThunk(
  'sommelier/sendMessage',
  async ({ session_id, prompt }, { rejectWithValue }) => {
    try {
      const response = await api.post(`${api_url}/v1/sommelier/chat`, { session_id, prompt });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to reach the sommelier');
    }
  }
);

export const fetchSommelierHistory = createAsyncThunk(
  'sommelier/fetchHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${api_url}/v1/sommelier/history`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch recommendation history');
    }
  }
);

export const submitSommelierFeedback = createAsyncThunk(
  'sommelier/submitFeedback',
  async ({ recommendation_log_id, feedback }, { rejectWithValue }) => {
    try {
      const response = await api.post(`${api_url}/v1/sommelier/feedback`, { recommendation_log_id, feedback });
      return { recommendation_log_id, feedback, data: response.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to submit feedback');
    }
  }
);

const sommelierSlice = createSlice({
  name: 'sommelier',
  initialState: {
    sessionId: null,
    messages: [],
    history: [],
    historyMeta: { total: 0, currentPage: 1, lastPage: 1 },
    loading: false,
    historyLoading: false,
    error: null,
    historyError: null,
    feedbackError: null,
  },
  reducers: {
    startNewSession: (state, action) => {
      state.sessionId = action.payload || `session-${Date.now()}`;
      state.messages = [];
    },
    clearSommelierError: (state) => {
      state.error = null;
      state.historyError = null;
      state.feedbackError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendSommelierMessage.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.messages.push({
          role: 'user',
          content: action.meta.arg.prompt,
          timestamp: new Date().toISOString(),
        });
      })
      .addCase(sendSommelierMessage.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload?.data || action.payload;
        state.sessionId = data?.session_id || state.sessionId;
        state.messages.push({
          role: 'assistant',
          content: data?.response || data?.message || data?.reply,
          recommendation_log_id: data?.recommendation_log_id,
          recommendations: data?.recommendations || [],
          timestamp: new Date().toISOString(),
        });
      })
      .addCase(sendSommelierMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchSommelierHistory.pending, (state) => {
        state.historyLoading = true;
        state.historyError = null;
      })
      .addCase(fetchSommelierHistory.fulfilled, (state, action) => {
        state.historyLoading = false;
        // Response is Laravel-paginated: { data: { data: [...], current_page, last_page, total } }
        const paginated = action.payload?.data || {};
        state.history = paginated.data || [];
        state.historyMeta = {
          total: paginated.total || 0,
          currentPage: paginated.current_page || 1,
          lastPage: paginated.last_page || 1,
        };
      })
      .addCase(fetchSommelierHistory.rejected, (state, action) => {
        state.historyLoading = false;
        state.historyError = action.payload;
      })

      .addCase(submitSommelierFeedback.pending, (state) => {
        state.feedbackError = null;
      })
      .addCase(submitSommelierFeedback.fulfilled, (state, action) => {
        const { recommendation_log_id, feedback } = action.payload;
        const msg = state.messages.find((m) => m.recommendation_log_id === recommendation_log_id);
        if (msg) msg.feedback = feedback;
        // History items use `id` as their identifier and `user_feedback` as the field name
        const historyItem = state.history.find((h) => h.id === recommendation_log_id);
        if (historyItem) historyItem.user_feedback = feedback;
      })
      .addCase(submitSommelierFeedback.rejected, (state, action) => {
        state.feedbackError = action.payload;
      });
  },
});

export const { startNewSession, clearSommelierError } = sommelierSlice.actions;
export default sommelierSlice.reducer;