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

// POST /products/{slug}/reviews — a customer who already reviewed this wine gets a
// 400 (not 422), with the explanation in `message`.
export const submitProductReview = createAsyncThunk(
  'catalog/submitProductReview',
  async ({ slug, rating, comment }, { rejectWithValue }) => {
    try {
      const response = await api.post(`${api_url}/v1/products/${slug}/reviews`, { rating, comment });
      return response.data;
    } catch (err) {
      if (err.response?.status === 422 && err.response?.data?.errors) {
        return rejectWithValue(Object.values(err.response.data.errors).flat().join(' '));
      }
      return rejectWithValue(err.response?.data?.message || 'Failed to submit review');
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

// The live API has answered `/products` with both a flat `{ data: [...], meta }`
// shape and (per the integration guide) a nested `{ data: { data: [...], meta } }`
// shape depending on when it was hit. Handle either so pagination doesn't silently
// break if/when the backend flips between them.
export const parseProductsResponse = (raw) => {
  const dataField = raw?.data;
  const isNested = !Array.isArray(dataField) && Array.isArray(dataField?.data);
  const products = isNested ? dataField.data : Array.isArray(dataField) ? dataField : [];
  const meta = isNested ? dataField.meta || null : raw?.meta || null;
  return { products, meta };
};

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

    // Products get their own loading flag — Shop/ProductDetail fire fetchProducts
    // alongside fetchCategories/fetchRegions, and those share the flag above.
    // Whichever resolves first would otherwise flip `loading` back to false while
    // the others are still in flight, flashing an empty state before products arrive.
    productsLoading: false,
    productsMeta: null,
    // Shop/Grapes/Home all fire an initial unfiltered fetchProducts on mount, then
    // a second, filtered one moments later (e.g. once a nav-link's category/search
    // intent resolves). Over the real network, responses don't always arrive in
    // request order — without tracking which request is actually the latest, a
    // slow *first* response can land after the second and silently overwrite the
    // correct, filtered result with the stale unfiltered one.
    productsRequestId: null,
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
      .addCase(fetchProducts.pending, (state, action) => {
        state.productsLoading = true;
        state.error = null;
        state.productsRequestId = action.meta.requestId;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        // A slower, now-superseded request resolving after a newer one — ignore it
        // rather than clobber the result the newer request already applied.
        if (action.meta.requestId !== state.productsRequestId) return;
        state.productsLoading = false;
        const { products: newProducts, meta } = parseProductsResponse(action.payload);
        state.productsMeta = meta;
        // Page 2+ (Shop's "View More") appends to the existing list instead of replacing it
        const page = Number(action.meta.arg?.page) || 1;
        state.products = page > 1 ? [...state.products, ...newProducts] : newProducts;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        if (action.meta.requestId !== state.productsRequestId) return;
        state.productsLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchProductBySlug.pending, (state) => { state.productsLoading = true; state.error = null; })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.productsLoading = false;
        state.selectedProduct = action.payload?.data || action.payload;
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => { state.productsLoading = false; state.error = action.payload; })
      
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