import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/Api'; 
import { api_url } from '../utils/config';

// ==========================================
// 1. PRODUCTS THUNKS (List with query params & Single)
// ==========================================
export const fetchProducts = createAsyncThunk(
  'catalog/fetchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(`${api_url}/v1/products`, { params });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const fetchProductBySlug = createAsyncThunk(
  'catalog/fetchProductBySlug',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await api.get(`${api_url}/v1/products/${slug}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Product not found');
    }
  }
);

// ==========================================
// 2. PRODUCT CATEGORIES THUNKS (List with query params & Single)
// ==========================================
export const fetchCategories = createAsyncThunk(
  'catalog/fetchCategories',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(`${api_url}/v1/categories`, { params });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

export const fetchCategoryBySlug = createAsyncThunk(
  'catalog/fetchCategoryBySlug',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await api.get(`${api_url}/v1/categories/${slug}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Category not found');
    }
  }
);

// ==========================================
// 3. WINE REGIONS THUNKS (List with query params & Single)
// ==========================================
export const fetchRegions = createAsyncThunk(
  'catalog/fetchRegions',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(`${api_url}/v1/regions`, { params });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch regions');
    }
  }
);

export const fetchRegionBySlug = createAsyncThunk(
  'catalog/fetchRegionBySlug',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await api.get(`${api_url}/v1/regions/${slug}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Region not found');
    }
  }
);

// ==========================================
// 4. BLOGS THUNKS (List with query params & Single)
// ==========================================
export const fetchBlogs = createAsyncThunk(
  'catalog/fetchBlogs',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(`${api_url}/v1/blogs`, { params });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch blogs');
    }
  }
);

export const fetchBlogBySlug = createAsyncThunk(
  'catalog/fetchBlogBySlug',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await api.get(`${api_url}/v1/blogs/${slug}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Blog post not found');
    }
  }
);

// ==========================================
// 5. BLOG CATEGORIES THUNK (List with query params)
// ==========================================
export const fetchBlogCategories = createAsyncThunk(
  'catalog/fetchBlogCategories',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(`${api_url}/v1/blog-categories`, { params });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch blog categories');
    }
  }
);

// ==========================================
// CATALOG SLICE CREATION
// ==========================================
const catalogSlice = createSlice({
  name: 'catalog',
  initialState: {
    // List arrays
    products: [],
    categories: [],
    regions: [],
    blogs: [],
    blogCategories: [],
    
    // Single detail profiles
    selectedProduct: null,
    selectedCategory: null,
    selectedRegion: null,
    selectedBlog: null,
    
    // Global UI states
    loading: false,
    error: null,
  },
  reducers: {
    clearCatalogStatus: (state) => {
      state.error = null;
    },
    clearSelectedItems: (state) => {
      state.selectedProduct = null;
      state.selectedCategory = null;
      state.selectedRegion = null;
      state.selectedBlog = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Products Lifecycles
      .addCase(fetchProducts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload?.data || action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchProductBySlug.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload?.data || action.payload;
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      
      // Product Categories Lifecycles
      .addCase(fetchCategories.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload?.data || action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchCategoryBySlug.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCategoryBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCategory = action.payload?.data || action.payload;
      })
      .addCase(fetchCategoryBySlug.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      
      // Wine Regions Lifecycles
      .addCase(fetchRegions.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchRegions.fulfilled, (state, action) => {
        state.loading = false;
        state.regions = action.payload?.data || action.payload;
      })
      .addCase(fetchRegions.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchRegionBySlug.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchRegionBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedRegion = action.payload?.data || action.payload;
      })
      .addCase(fetchRegionBySlug.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      
      // Blogs Lifecycles
      .addCase(fetchBlogs.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload?.data || action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchBlogBySlug.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchBlogBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBlog = action.payload?.data || action.payload;
      })
      .addCase(fetchBlogBySlug.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Blog Categories Lifecycles
      .addCase(fetchBlogCategories.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchBlogCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.blogCategories = action.payload?.data || action.payload;
      })
      .addCase(fetchBlogCategories.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearCatalogStatus, clearSelectedItems } = catalogSlice.actions;
export default catalogSlice.reducer;