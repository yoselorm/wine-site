import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Package, Heart, Wallet as WalletIcon, Sparkles, ChevronRight } from 'lucide-react';
import { fetchOrders } from '../../redux/orderSlice';
import { fetchWishlist } from '../../redux/wishlistSlice';
import { fetchWallet } from '../../redux/walletSlice';
import { selectIsTasteProfileComplete } from '../../redux/tasteProfileSlice';

const StatCard = ({ icon: Icon, label, value, to }) => (
  <Link
    to={to}
    className="bg-white border border-zinc-200 rounded-xl p-6 flex items-center gap-4 hover:border-forest transition-colors duration-300 group"
  >
    <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center shrink-0 group-hover:bg-forest transition-colors duration-300">
      <Icon size={20} className="text-forest group-hover:text-white transition-colors duration-300" />
    </div>
    <div className="min-w-0">
      <p className="text-2xl font-serif text-zinc-900 truncate">{value}</p>
      <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">{label}</p>
    </div>
  </Link>
);

const Overview = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items: orders, loading: ordersLoading } = useSelector((state) => state.orders);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { balance, currency } = useSelector((state) => state.wallet);
  const isTasteProfileComplete = useSelector(selectIsTasteProfileComplete);

  useEffect(() => {
    dispatch(fetchOrders());
    dispatch(fetchWishlist());
    dispatch(fetchWallet());
  }, [dispatch]);

  const firstName = user?.first_name || user?.name?.split(' ')[0] || 'there';
  const recentOrders = orders.slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl lg:text-4xl font-serif text-zinc-900 mb-2">Welcome back, {firstName}</h1>
        <p className="text-sm text-zinc-500 font-light">Here's what's happening with your account.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatCard icon={Package} label="Orders" value={orders.length} to="/user/orders" />
        <StatCard icon={Heart} label="Wishlist" value={wishlistItems.length} to="/user/wishlist" />
        <StatCard icon={WalletIcon} label="Wallet Balance" value={`${currency} ${Number(balance).toFixed(2)}`} to="/user/wallet" />
        <StatCard icon={Sparkles} label="Taste Profile" value={isTasteProfileComplete ? 'Complete' : 'Incomplete'} to="/user/taste-profile" />
      </div>

      {!isTasteProfileComplete && (
        <div className="bg-forest rounded-xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 mb-10 text-white">
          <div className="flex items-center gap-4">
            <Sparkles size={28} className="text-gold-light shrink-0" strokeWidth={1.5} />
            <div>
              <h3 className="font-serif text-xl mb-1">Complete your taste profile</h3>
              <p className="text-sm text-cream/60 font-light">Get personalized wine recommendations from our Virtual Sommelier.</p>
            </div>
          </div>
          <Link
            to="/user/taste-profile"
            className="shrink-0 bg-gold text-forest-dark px-6 py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-gold-light transition-colors duration-300"
          >
            Get Started
          </Link>
        </div>
      )}

      <div className="bg-white border border-zinc-200 rounded-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif text-xl text-zinc-900">Recent Orders</h3>
          <Link
            to="/user/orders"
            className="text-[11px] font-bold uppercase tracking-widest text-forest hover:text-gold transition-colors flex items-center gap-1"
          >
            View All <ChevronRight size={14} />
          </Link>
        </div>

        {ordersLoading ? (
          <div className="space-y-3 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-zinc-100 rounded" />
            ))}
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package size={36} strokeWidth={1} className="text-zinc-300 mx-auto mb-4" />
            <p className="text-zinc-500 font-light mb-5">You haven't placed any orders yet.</p>
            <Link
              to="/shop"
              className="text-[11px] font-bold uppercase tracking-widest text-forest border-b border-forest pb-1 hover:text-forest-dark hover:border-forest-dark transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {recentOrders.map((order) => (
              <Link key={order.id} to={`/orders/${order.id}`} className="flex items-center justify-between py-4 group">
                <div>
                  <p className="text-sm font-serif text-zinc-900 group-hover:text-forest transition-colors">
                    Order #{order.order_number || order.id}
                  </p>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {order.created_at
                      ? new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                      : ''}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-zinc-700">GHS {Number(order.total || order.total_amount || 0).toFixed(2)}</span>
                  <ChevronRight size={16} className="text-zinc-300 group-hover:text-forest transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Overview;
