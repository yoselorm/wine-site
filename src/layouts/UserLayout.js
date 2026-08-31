import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { User, Package, Heart, Sparkles, CreditCard, MapPin, ArrowLeft, LogOut, Wine, Menu, X } from 'lucide-react';
import { logoutUser } from '../redux/authSlice';
import toast from '../components/Toast';
import TasteProfileReminderModal from '../components/auth/TasteProfileReminderModal';
import TasteQuizModal from '../components/auth/TasteQuizModal';
import logo from '../assets/images/logo.png';

const UserLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerShown, setDrawerShown] = useState(false);

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

  const openDrawer = () => {
    setDrawerVisible(true);
    requestAnimationFrame(() => setDrawerShown(true));
  };

  const closeDrawer = () => {
    setDrawerShown(false);
    setTimeout(() => setDrawerVisible(false), 300);
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  const NavItems = ({ onNavigate }) => (
    <nav className="space-y-1">
      {menuItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          onClick={onNavigate}
          className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-300 ${
            isActive ? 'bg-forest text-white' : 'text-zinc-600 hover:bg-cream'
          }`}
        >
          <item.icon size={16} /> {item.name}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-cream flex flex-col">
        <TasteProfileReminderModal />

      {/* Top Bar */}
      <header className="bg-white border-b border-zinc-100 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3 sm:gap-6">
          <button
            onClick={openDrawer}
            aria-label="Open menu"
            className="md:hidden text-zinc-600 hover:text-forest transition-colors"
          >
            <Menu size={22} />
          </button>
          <Link to="/" className="shrink-0">
            <img src={logo} alt="w2u" className="h-9 sm:h-10 w-auto" />
          </Link>
          <div className="hidden sm:block w-px h-6 bg-zinc-200" />
          <Link
            to="/shop"
            className="hidden sm:flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-zinc-500 hover:text-forest transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Shop
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-forest text-white flex items-center justify-center text-xs font-bold">
              {initials}
            </div>
            <span className="text-sm text-zinc-700 font-medium">{user?.name || 'My Account'}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-zinc-500 hover:text-wine transition-colors px-2 sm:px-3 py-2"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex min-w-0">
        {/* Sidebar Navigation (tablet/desktop) */}
        <aside className="hidden md:block w-64 bg-white border-r border-zinc-100 p-6 shrink-0 sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto">
          <h2 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-6">User Hub</h2>
          <NavItems />
        </aside>

        {/* Mobile Nav Drawer */}
        {drawerVisible &&
          createPortal(
            <div className="fixed inset-0 z-[100] md:hidden">
              <div
                className={`fixed inset-0 bg-zinc-950/50 transition-opacity duration-300 ease-out ${drawerShown ? 'opacity-100' : 'opacity-0'}`}
                onClick={closeDrawer}
              />
              <div
                className={`fixed inset-y-0 left-0 w-72 max-w-[80vw] bg-white shadow-2xl p-6 overflow-y-auto transition-transform duration-300 ease-out ${
                  drawerShown ? 'translate-x-0' : '-translate-x-full'
                }`}
              >
                <div className="flex items-center justify-between mb-8">
                  <img src={logo} alt="w2u" className="h-9 w-auto" />
                  <button onClick={closeDrawer} aria-label="Close menu" className="text-zinc-400 hover:text-forest transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <h2 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-6">User Hub</h2>
                <NavItems onNavigate={closeDrawer} />

                <div className="mt-8 pt-6 border-t border-zinc-100">
                  <Link
                    to="/shop"
                    onClick={closeDrawer}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-zinc-600 hover:bg-cream transition-colors"
                  >
                    <ArrowLeft size={16} /> Back to Shop
                  </Link>
                </div>
              </div>
            </div>,
            document.body
          )}

        {/* Main Viewport */}
        <div className="flex-1 min-w-0 p-4 sm:p-6 md:p-8">
          <Outlet />
        </div>
      </div>

      {/* Floating Sommelier Launcher */}
      <Link
        to="/user/sommelier"
        className="fixed bottom-8 left-8 w-14 h-14 rounded-full bg-forest text-white flex items-center justify-center shadow-lg hover:bg-forest-dark hover:scale-105 transition-all duration-300 z-40 group"
        title="Ask the Virtual Sommelier"
      >
        <Wine size={22} />
        <span className="absolute left-16 bg-forest-dark text-white text-[11px] font-bold uppercase tracking-wide px-3 py-2 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          Ask the Sommelier
        </span>
      </Link>
    </div>
  );
};

export default UserLayout;