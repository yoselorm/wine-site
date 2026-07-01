import {configureStore} from '@reduxjs/toolkit';
import authReducer from './redux/authSlice';
import catalogReducer from './redux/catalogSlice';
import wishlistReducer from './redux/wishlistSlice';
import cartReducer from './redux/cartSlice';
import ordersReducer from './redux/orderSlice';
import tasteProfileReducer from './redux/tasteProfileSlice';
import sommelierReducer from './redux/sommelierSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    catalog: catalogReducer,
    wishlist: wishlistReducer,
    cart: cartReducer,
    orders: ordersReducer,
    tasteProfile: tasteProfileReducer,
    sommelier: sommelierReducer,
  },
});

export default store;