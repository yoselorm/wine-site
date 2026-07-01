import React from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { User, Package, Heart, Sparkles, CreditCard, MapPin, ArrowLeft, LogOut, Wine } from 'lucide-react';
import { logoutUser } from '../redux/authSlice';
import toast from '../components/Toast';

const UserLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const menuItems = [
    { name: 'Dashboard', path: '/user/dashboard', icon: User },
    { name: 'Orders', path: '/user/orders', icon: Package },
    { name: 'Taste Profile', path: '/user/taste-profile', icon: Sparkles },
    { name: 'Wishlist', path: '/user/wishlist', icon: Heart },
    { name: 'Wallet', path: '/user/wallet', icon: CreditCard },
    { name: 'Addresses', path: '/user/addresses', icon: MapPin },
  ];

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success('Logged out successfully');
    navigate('/');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      {/* Top Bar */}
      <header className="bg-white border-b border-zinc-100 px-8 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-serif font-bold tracking-tighter text-zinc-900">
            WINE2U
          </Link>
          <div className="hidden sm:block w-px h-6 bg-zinc-200" />
          <Link
            to="/shop"
            className="hidden sm:flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Shop
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-bold">
              {initials}
            </div>
            <span className="text-sm text-zinc-700 font-medium">{user?.name || 'My Account'}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-zinc-500 hover:text-red-500 transition-colors px-3 py-2"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white border-r border-zinc-100 p-6 shrink-0">
          <h2 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-6">User Hub</h2>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <NavLink 
                key={item.name}
                to={item.path}
                className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                <item.icon size={16} /> {item.name}
              </NavLink>
            ))}
          </nav>

          <div className="mt-8 pt-6 border-t border-zinc-100 sm:hidden">
            <Link
              to="/shop"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-zinc-600 hover:bg-zinc-100 transition-colors"
            >
              <ArrowLeft size={16} /> Back to Shop
            </Link>
          </div>
        </aside>

        {/* Main Viewport */}
        <div className="flex-1 p-8">
          <Outlet />
        </div>
      </div>

      {/* Floating Sommelier Launcher */}
      <Link
        to="/user/sommelier"
        className="fixed bottom-8 left-8 w-14 h-14 rounded-full bg-zinc-900 text-white flex items-center justify-center shadow-lg hover:bg-zinc-800 hover:scale-105 transition-all duration-300 z-40 group"
        title="Ask the Virtual Sommelier"
      >
        <Wine size={22} />
        <span className="absolute left-16 bg-zinc-900 text-white text-[11px] font-bold uppercase tracking-wide px-3 py-2 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          Ask the Sommelier
        </span>
      </Link>
    </div>
  );
};

export default UserLayout;