import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";
import UserLayout from "./layouts/UserLayout";
import PublicLayout from "./layouts/PublicLayout";
import Home from "./pages/public/Home";
import Shop from "./pages/public/Shop";
import ProductDetail from "./pages/public/ProductDetail";
import Wishlist from "./pages/auth/wishlist";
import TasteProfile from "./pages/auth/TasteProfile";
import Orders from "./pages/auth/Orders";
import Wallet from "./pages/auth/Wallet";
import Addresses from "./pages/auth/Addresses";
import Sommelier from "./pages/auth/Sommelier";
import About from "./pages/public/About";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchTasteProfile } from "./redux/tasteProfileSlice";


function App() {

   const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchTasteProfile());
    }
  }, [isAuthenticated, dispatch]);
  return (
<Routes>
  {/* Public Pages */}
  <Route element={<PublicLayout />}>
   <Route path="/" element={<Home />} />
     <Route path="/shop" element={<Shop />} />
     <Route path="/shop/:slug" element={<ProductDetail />} />
     <Route path="/about" element={<About />} />
  </Route>

  {/* Authenticated User Pages */}
  <Route element={<ProtectedRoute><UserLayout /></ProtectedRoute>}>
  <Route path="/user/dashboard" element={<div>User Dashboard</div>} />
   <Route path="/user/orders" element={<Orders />} />
    <Route path="/user/taste-profile" element={<TasteProfile />} /> 
    <Route path="/user/wishlist" element={<Wishlist/>} />
    <Route path="/user/wallet" element={<Wallet />} />
    <Route path="/user/addresses" element={<Addresses  />} />
    <Route path="/user/sommelier" element={<Sommelier />} />
  </Route>
</Routes>
  );
}

export default App;
