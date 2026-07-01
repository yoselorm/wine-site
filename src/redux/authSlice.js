import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/Api'; 
import { api_url } from '../utils/config';

// Safely pull persisted user session from localStorage
const getInitialUserData = () => {
  const data = localStorage.getItem('user_data');
  return data ? JSON.parse(data) : null;
};

const initialUserData = getInitialUserData();

// 1. User Login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post(`${api_url}/login`, credentials);
      // Grabs user profile and JWT token payload from backend structure
      return response.data?.data; 
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

// 2. User Register
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post(`${api_url}/register`, userData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

// 3. User Registration Code Generation
export const requestRegistrationCode = createAsyncThunk(
  'auth/requestRegistrationCode',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post(`${api_url}/code`, data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to send registration code');
    }
  }
);

// 4. Forgot Password (Send Reset Link)
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.post(`${api_url}/forgot-password`, { email });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to send reset link');
    }
  }
);

// 5. Reset Password (Submit new credentials)
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (resetData, { rejectWithValue }) => {
    try {
      const response = await api.post(`${api_url}/reset-password`, resetData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Password reset failed');
    }
  }
);

// 6. Send Email Verification Notification Link
export const sendVerificationEmail = createAsyncThunk(
  'auth/sendVerificationEmail',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post(`${api_url}/email/verification-notification`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to send verification link');
    }
  }
);

// 7. Verify Email via Link (GET request verification signature)
export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async ({ id, hash }, { rejectWithValue }) => {
    try {
      const response = await api.get(`${api_url}/verify-email/${id}/${hash}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Email verification failed');
    }
  }
);

// 8. User Logout
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await api.post(`${api_url}/logout`);
      localStorage.removeItem('user_data');
      return true;
    } catch (err) {
      localStorage.removeItem('user_data'); 
      return rejectWithValue('Logout error');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: initialUserData || null,
    token: initialUserData?.token || null,
    isAuthenticated: !!initialUserData?.token,
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearStatus: (state) => {
      state.error = null;
      state.message = null;
    },
    forceLogout: (state) => {
      localStorage.removeItem('user_data');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.message = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // User Login Lifecycles
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload?.token;
        state.isAuthenticated = true;
        localStorage.setItem('user_data', JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // User Register Lifecycles
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "Registration successful";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Registration Code Lifecycles
      .addCase(requestRegistrationCode.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(requestRegistrationCode.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "Code sent successfully";
      })
      .addCase(requestRegistrationCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Forgot Password Lifecycles
      .addCase(forgotPassword.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "Reset link sent successfully";
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Reset Password Lifecycles
      .addCase(resetPassword.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "Password reset successful";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Send Verification Email Lifecycles
      .addCase(sendVerificationEmail.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(sendVerificationEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "Verification link sent to email";
      })
      .addCase(sendVerificationEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Link Verification Lifecycles
      .addCase(verifyEmail.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "Email verified successfully";
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // User Logout Lifecycles
      .addCase(logoutUser.pending, (state) => { state.loading = true; })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
        state.message = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearStatus, forceLogout } = authSlice.actions;
export default authSlice.reducer;