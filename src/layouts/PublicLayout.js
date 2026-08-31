import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, ChevronDown, Wine, User } from 'lucide-react';
import { useSelector } from 'react-redux';
import TasteProfileReminderModal from '../components/auth/TasteProfileReminderModal';
import NewsletterModal from '../components/public/NewsletterModal';
import AppCTA from '../components/public/home/AppCTA';
import { FacebookIcon, TwitterIcon, InstagramIcon } from '../components/public/shared/SocialIcons';
import { getInitials } from '../utils/placeholders';
import { selectCartCount } from '../redux/cartSlice';
import logo from '../assets/images/logo.png';
import footerBg from '../assets/images/footer.jpg';

const NAV_LINKS = [
  { label: 'Wines', to: '/shop' },
  { label: 'Champagnes', to: '/shop?category=champagne' },
  { label: 'Cognacs', to: '/shop?category=cognac' },
  { label: 'Pairings', to: '/shop', dropdown: true },
  { label: 'Grapes', to: '/shop' },
  { label: 'Regions', to: '/shop' },
  { label: 'Our Blog', to: '/blog' },
];

const PublicLayout = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const cartCount = useSelector(selectCartCount);
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = e.target.elements.q?.value?.trim() || '';
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
  };

  const displayName = user?.first_name
    ? `${user.first_name} ${user.last_name || ''}`.trim()
    : user?.name || 'Account';

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2C2C2C] font-sans antialiased selection:bg-[#C5A880] selection:text-white">
      <TasteProfileReminderModal />
      <NewsletterModal />

      {/* Sticky Header with Smooth Transition */}
   {/* Sticky Header with Reduced Height & Enlarged Logo */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ease-in-out ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-b border-stone-200/60'
            : 'bg-transparent border-b border-stone-200/40'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-2 flex items-center justify-between gap-4">
          {/* Social Links */}
          <div className="flex items-center gap-3.5 text-stone-500">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="hover:text-[#C5A880] transition-colors p-1"
            >
              <FacebookIcon className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
              className="hover:text-[#C5A880] transition-colors p-1"
            >
              <TwitterIcon className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="hover:text-[#C5A880] transition-colors p-1"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Enlarged Logo */}
          <Link to="/" className="shrink-0 transition-transform duration-200 hover:scale-[1.03]">
            <img src={logo} alt="wine 2 u" className="h-14 sm:h-16 w-auto object-contain py-0.5" />
          </Link>

          {/* Actions: Search, Cart, Account */}
          <div className="flex items-center gap-4 sm:gap-6 text-stone-700">
            <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center">
              <button
                type="submit"
                aria-label="Search"
                className="hover:text-[#1F3D2B] transition-colors p-1"
              >
                <Search size={17} strokeWidth={1.8} />
              </button>
              <input type="hidden" name="q" />
            </form>
            <Link
              to="/search"
              className="md:hidden hover:text-[#1F3D2B] transition-colors p-1"
              aria-label="Search"
            >
              <Search size={17} strokeWidth={1.8} />
            </Link>

            <Link
              to="/cart"
              className="relative hover:text-[#1F3D2B] transition-colors p-1"
              aria-label="Cart"
            >
              <ShoppingBag size={18} strokeWidth={1.8} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#C5A880] text-white text-[9px] font-semibold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <Link
                to="/user/dashboard"
                className="flex items-center gap-2 text-xs font-medium text-stone-800 hover:text-[#1F3D2B] transition-colors"
              >
                <span className="w-7 h-7 rounded-full bg-[#1F3D2B] text-white flex items-center justify-center text-[10px] font-bold">
                  {getInitials(displayName)}
                </span>
                <span className="hidden sm:inline font-serif">{displayName}</span>
              </Link>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-stone-700 font-medium">
                <User size={15} strokeWidth={1.8} className="text-stone-500" />
                <Link to="/login" className="hover:text-[#1F3D2B] transition-colors">
                  Login
                </Link>
                <span className="text-stone-300">/</span>
                <Link to="/register" className="hover:text-[#1F3D2B] transition-colors">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Secondary Navigation - Compact Height */}
        <nav className="border-t border-stone-200/50">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-center gap-6 sm:gap-9 text-[11px] tracking-wide text-stone-600 uppercase font-medium py-1.5 overflow-x-auto no-scrollbar">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="hover:text-[#1F3D2B] transition-colors flex items-center gap-1 shrink-0 group relative py-0.5"
              >
                <span>{link.label}</span>
                {link.dropdown && (
                  <ChevronDown
                    size={11}
                    className="text-stone-400 group-hover:text-[#1F3D2B] transition-colors"
                  />
                )}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#C5A880] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <div key={location.pathname} className="animate-fade-in">
          <Outlet />
        </div>
      </main>

      {/* Floating Sommelier Trigger */}
      {isAuthenticated && (
        <Link
          to="/user/sommelier"
          className="group fixed bottom-8 right-8 z-40 flex items-center gap-2.5 bg-[#1F3D2B] text-white pl-4 pr-4 py-3.5 rounded-full shadow-xl hover:shadow-2xl hover:bg-[#162C1F] transition-all duration-300 ring-1 ring-[#C5A880]/30"
        >
          <Wine size={17} className="text-[#C5A880]" />
          <span className="text-[10px] font-bold uppercase tracking-widest max-w-0 overflow-hidden group-hover:max-w-[130px] transition-all duration-300 whitespace-nowrap">
            Ask Sommelier
          </span>
        </Link>
      )}

      {/* Redesigned Dark Green Luxury Footer */}
   {/* Redesigned Footer with Background Image Overlay */}
      <footer className="relative bg-[#0F2218] text-stone-200 mt-auto overflow-hidden">
        {/* Background Image with Dark Green Gradient Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src={footerBg}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-right sm:object-center opacity-40 mix-blend-luminosity"
          />
          {/* Deep green overlay tint */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F2218]/95 via-[#132A1E]/80 to-[#14261B]/90" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 pt-16 pb-12">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12 items-start mb-12">
            
            {/* Left: Brand Logo, Copyright & Socials */}
            <div className="col-span-2 flex flex-col gap-3">
              <Link to="/" className="w-fit">
                <img
                  src={logo}
                  alt="w2u"
                  className="h-11 w-auto object-contain brightness-110"
                />
              </Link>
              <p className="text-xs text-stone-300 font-light">
                &copy;{new Date().getFullYear()} wine2u
              </p>
              
              {/* Clean Outline Social Icons */}
              <div className="flex items-center gap-4 pt-2 text-stone-200">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="hover:text-[#C5A880] transition-colors"
                >
                  <FacebookIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="hover:text-[#C5A880] transition-colors"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Twitter"
                  className="hover:text-[#C5A880] transition-colors"
                >
                  <TwitterIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="hover:text-[#C5A880] transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Discover */}
            <div className="flex flex-col gap-2.5">
              <h4 className="font-serif text-base text-[#C5A880] mb-1 font-normal tracking-wide">
                Discover
              </h4>
              <Link to="/shop" className="text-[13px] text-stone-300/90 hover:text-white transition-colors w-fit font-light">
                Wines
              </Link>
              <Link to="/shop?category=champagne" className="text-[13px] text-stone-300/90 hover:text-white transition-colors w-fit font-light">
                Champagnes
              </Link>
              <Link to="/shop?category=cognac" className="text-[13px] text-stone-300/90 hover:text-white transition-colors w-fit font-light">
                Cognacs
              </Link>
            </div>

            {/* More */}
            <div className="flex flex-col gap-2.5">
              <h4 className="font-serif text-base text-[#C5A880] mb-1 font-normal tracking-wide">
                More
              </h4>
              <Link to="/about" className="text-[13px] text-stone-300/90 hover:text-white transition-colors w-fit font-light">
                About Us
              </Link>
              <Link to="/shop" className="text-[13px] text-stone-300/90 hover:text-white transition-colors w-fit font-light">
                Food Pairings
              </Link>
              <Link to="/blog" className="text-[13px] text-stone-300/90 hover:text-white transition-colors w-fit font-light">
                Koko's Blog
              </Link>
            </div>

            {/* Legal */}
            <div className="flex flex-col gap-2.5">
              <h4 className="font-serif text-base text-[#C5A880] mb-1 font-normal tracking-wide">
                Legal
              </h4>
              <Link to="/privacy" className="text-[13px] text-stone-300/90 hover:text-white transition-colors w-fit font-light">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-[13px] text-stone-300/90 hover:text-white transition-colors w-fit font-light">
                Terms of Use
              </Link>
            </div>

            {/* Apps */}
            <div className="flex flex-col gap-2.5">
              <h4 className="font-serif text-base text-[#C5A880] mb-1 font-normal tracking-wide">
                Apps
              </h4>
              <span className="text-[13px] text-stone-300/90 hover:text-white cursor-pointer transition-colors w-fit font-light">
                iOS
              </span>
              <span className="text-[13px] text-stone-300/90 hover:text-white cursor-pointer transition-colors w-fit font-light">
                Android
              </span>
            </div>
          </div>

          {/* Right-Aligned Clean Copyright */}
          <div className="flex justify-end pt-4">
            <p className="text-[11px] text-stone-400 font-light tracking-wide">
              Copyright &copy; {new Date().getFullYear()} wine2u - All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;