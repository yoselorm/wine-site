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
import Blogs from "./pages/auth/Blogs";
import Addresses from "./pages/auth/Addresses";
import Sommelier from "./pages/auth/Sommelier";
import Overview from "./pages/auth/Overview";
import PrivacyPolicy from "./pages/public/PrivacyPolicy";
import TermsConditions from "./pages/public/TermsConditions";
import About from "./pages/public/About";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchTasteProfile } from "./redux/tasteProfileSlice";
import BlogDetail from "./pages/auth/BlogDetail";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import SearchResults from "./pages/public/SearchResults";
import NotFound from "./pages/public/NotFound";


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
      <Route path="/blog" element={<Blogs />} />
    <Route path="/blog/:id" element={<BlogDetail />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/search" element={<SearchResults />} />
    <Route path="/privacy" element={<PrivacyPolicy />} />
    <Route path="/terms" element={<TermsConditions />} />
    <Route path="*" element={<NotFound />} />
  </Route>

  {/* Authenticated User Pages */}
  <Route element={<ProtectedRoute><UserLayout /></ProtectedRoute>}>
  <Route path="/user/dashboard" element={<Overview />} />
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
