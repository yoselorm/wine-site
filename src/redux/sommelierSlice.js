// src/redux/sommelierSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/Api';
import { api_url } from '../utils/config';

// POST /api/v1/sommelier/chat — Chat with the Virtual Sommelier
export const sendSommelierMessage = createAsyncThunk(
  'sommelier/sendMessage',
  async ({ session_id, prompt }, { rejectWithValue }) => {
    try {
      const response = await api.post(`${api_url}/v1/sommelier/chat`, {
        session_id,
        prompt,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to reach the sommelier');
    }
  }
);

// GET /api/v1/sommelier/history — Get user recommendation history
export const fetchSommelierHistory = createAsyncThunk(
  'sommelier/fetchHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${api_url}/v1/sommelier/history`);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch recommendation history');
    }
  }
);

// POST /api/v1/sommelier/feedback — Submit feedback on a recommendation
export const submitSommelierFeedback = createAsyncThunk(
  'sommelier/submitFeedback',
  async ({ recommendation_log_id, feedback }, { rejectWithValue }) => {
    try {
      const response = await api.post(`${api_url}/v1/sommelier/feedback`, {
        recommendation_log_id,
        feedback, // e.g. "liked" / "disliked"
      });
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
    messages: [],       // [{ role: 'user' | 'assistant', content, recommendation_log_id?, timestamp }]
    history: [],
    loading: false,      // chat send in progress
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
      // Chat
      .addCase(sendSommelierMessage.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        // Optimistically push the user's message
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

      // History
      .addCase(fetchSommelierHistory.pending, (state) => {
        state.historyLoading = true;
        state.historyError = null;
      })
      .addCase(fetchSommelierHistory.fulfilled, (state, action) => {
        state.historyLoading = false;
        state.history = action.payload?.data || action.payload || [];
      })
      .addCase(fetchSommelierHistory.rejected, (state, action) => {
        state.historyLoading = false;
        state.historyError = action.payload;
      })

      // Feedback
      .addCase(submitSommelierFeedback.pending, (state) => {
        state.feedbackError = null;
      })
      .addCase(submitSommelierFeedback.fulfilled, (state, action) => {
        const { recommendation_log_id, feedback } = action.payload;
        // Reflect feedback on the matching chat message, if present
        const msg = state.messages.find((m) => m.recommendation_log_id === recommendation_log_id);
        if (msg) msg.feedback = feedback;
        // Reflect feedback on the matching history entry, if present
        const historyItem = state.history.find((h) => h.id === recommendation_log_id || h.recommendation_log_id === recommendation_log_id);
        if (historyItem) historyItem.feedback = feedback;
      })
      .addCase(submitSommelierFeedback.rejected, (state, action) => {
        state.feedbackError = action.payload;
      });
  },
});

export const { startNewSession, clearSommelierError } = sommelierSlice.actions;
export default sommelierSlice.reducer;