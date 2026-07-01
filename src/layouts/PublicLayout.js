import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ShoppingBag, Heart, User, Search, Wine } from 'lucide-react';
import { useSelector } from 'react-redux';
import AuthModal from '../components/auth/AuthModal';

const PublicLayout = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <header className="fixed w-full z-50 px-8 py-6 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-zinc-100">
        <Link to="/" className="text-2xl font-serif font-bold tracking-tighter">WINE2U</Link>
        
        <nav className="flex gap-8 text-[11px] font-bold uppercase tracking-widest text-zinc-500">
          <Link to="/shop" className="hover:text-zinc-900 transition-colors">Shop</Link>
          <Link to="/blog" className="hover:text-zinc-900 transition-colors">Blogs</Link>
          <Link to="/about" className="hover:text-zinc-900 transition-colors">About</Link>
        </nav>

        <div className="flex items-center gap-6">
          <button className="text-zinc-600 hover:text-zinc-900"><Search size={18} /></button>
          
          {isAuthenticated && (
            <Link to="/user/wishlist" className="text-zinc-600 hover:text-red-500 transition-colors"><Heart size={18} /></Link>
          )}
          
          <button className="text-zinc-600 hover:text-zinc-900 relative">
            <ShoppingBag size={18} />
            <span className="absolute -top-2 -right-2 bg-zinc-900 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">0</span>
          </button>

          {/* Conditional Rendering for Authentication */}
          {isAuthenticated ? (
            <Link 
              to="/user/dashboard" 
              className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest hover:text-zinc-500"
            >
              <User size={16} /> Account
            </Link>
          ) : (
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest hover:text-zinc-500"
            >
              <User size={16} /> Login
            </button>
          )}
        </div>
      </header>

      {/* Added pt-24 to prevent the fixed header from overlapping the content */}
      <main className="flex-grow pt-20"><Outlet /></main>

      {/* Floating Sommelier Launcher */}
      {isAuthenticated && (
        <Link
          to="/user/sommelier"
          className="group fixed bottom-8 right-8 z-40 flex items-center gap-3 bg-zinc-900 text-white pl-4 pr-5 py-4 rounded-full shadow-lg hover:shadow-xl hover:bg-zinc-800 transition-all"
        >
          <Wine size={18} />
          <span className="text-[11px] font-bold uppercase tracking-widest max-w-0 overflow-hidden group-hover:max-w-[140px] transition-all duration-300 whitespace-nowrap">
            Ask Sommelier
          </span>
        </Link>
      )}
      
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      
      <footer className="bg-[#1C1C1A] text-[#FDFBF7]/70 py-20 px-8 mt-auto border-t border-zinc-800">
        <div className="max-w-7xl mx-auto flex flex-col gap-16">
          
          {/* Top Row: Newsletter & Links */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
            
            {/* Newsletter Section */}
            <div className="lg:col-span-5">
              <h3 className="text-white text-xl font-serif mb-4">Join our Cellar Club</h3>
              <p className="text-sm font-light mb-8 max-w-sm leading-relaxed">
                Subscribe to receive updates on exclusive vintages, tasting events, and early access to new releases directly from the vineyard.
              </p>
              <div className="flex items-end gap-4 max-w-sm">
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full bg-transparent border-b border-[#FDFBF7]/30 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-white transition-colors"
                />
                <button className="text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:text-zinc-400 transition-colors pb-2 border-b border-transparent">
                  Subscribe
                </button>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div className="flex flex-col gap-4">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white mb-2">Explore</h4>
                <Link to="/shop" className="text-sm hover:text-white transition-colors w-fit">Shop All</Link>
                <Link to="/shop?category=red" className="text-sm hover:text-white transition-colors w-fit">Red Wines</Link>
                <Link to="/shop?category=white" className="text-sm hover:text-white transition-colors w-fit">White Wines</Link>
                <Link to="/shop?category=champagne" className="text-sm hover:text-white transition-colors w-fit">Champagne</Link>
              </div>
              <div className="flex flex-col gap-4">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white mb-2">Company</h4>
                <Link to="/about" className="text-sm hover:text-white transition-colors w-fit">Our Story</Link>
                <Link to="/vineyard" className="text-sm hover:text-white transition-colors w-fit">The Vineyard</Link>
                <Link to="/journal" className="text-sm hover:text-white transition-colors w-fit">Journal</Link>
                <Link to="/contact" className="text-sm hover:text-white transition-colors w-fit">Contact Us</Link>
              </div>
              <div className="flex flex-col gap-4">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white mb-2">Legal</h4>
                <Link to="/terms" className="text-sm hover:text-white transition-colors w-fit">Terms of Service</Link>
                <Link to="/privacy" className="text-sm hover:text-white transition-colors w-fit">Privacy Policy</Link>
                <Link to="/shipping" className="text-sm hover:text-white transition-colors w-fit">Shipping & Returns</Link>
              </div>
            </div>
          </div>

          {/* Bottom Row: Logo & Copyright */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-[#FDFBF7]/10">
            <div className="text-2xl font-serif font-bold tracking-tighter text-white">WINE2U</div>
            <p className="text-xs font-light tracking-wide text-[#FDFBF7]/50">
              &copy; {new Date().getFullYear()} WINE2U. All rights reserved.
            </p>
          </div>

        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;