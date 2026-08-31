import {configureStore} from '@reduxjs/toolkit';
import authReducer from './redux/authSlice';
import catalogReducer from './redux/catalogSlice';
import wishlistReducer from './redux/wishlistSlice';
import cartReducer from './redux/cartSlice';
import ordersReducer from './redux/orderSlice';
import tasteProfileReducer from './redux/tasteProfileSlice';
import sommelierReducer from './redux/sommelierSlice';
import walletReducer from './redux/walletSlice';
import addressesReducer from './redux/addressSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    catalog: catalogReducer,
    wishlist: wishlistReducer,
    cart: cartReducer,
    orders: ordersReducer,
    tasteProfile: tasteProfileReducer,
    sommelier: sommelierReducer,
    wallet: walletReducer,
    addresses: addressesReducer,
  },
});

export default store;