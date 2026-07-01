import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser, clearStatus } from '../../redux/authSlice';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import authImage from '../../assets/images/auth.jpg';

const AuthModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  
  const { loading, error, message } = useSelector((state) => state.auth);

  const [isLogin, setIsLogin] = useState(true);
  const [animation, setAnimation] = useState('fade-in'); 
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const toggleMode = () => {
    setAnimation('fade-out');
    dispatch(clearStatus());
    setTimeout(() => {
      setIsLogin(!isLogin);
      setAnimation('fade-in');
    }, 200); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const targetThunk = isLogin ? loginUser : registerUser;
    const payload = isLogin 
      ? { email: formData.email, password: formData.password } 
      : {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.password_confirmation,
        };

    const result = await dispatch(targetThunk(payload));
    
    if (result.meta.requestStatus === 'fulfilled') {
      if (isLogin) {
        onClose();
      }
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm animate-fade-in" 
        onClick={onClose} 
      />
      
      {/* Modal Container - Cinematic Split Layout on Desktop */}
      <div className="bg-[#FDFBF7] w-full max-w-5xl h-[90vh] md:h-[700px] relative z-50 shadow-2xl flex overflow-hidden rounded-sm animate-scale-in">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-900 z-10 transition-colors"
        >
          <X size={20} />
        </button>

        {/* LEFT SIDE: Atmospheric Imagery (Hidden on Mobile) */}
        <div className="hidden md:block w-1/2 relative">
          <img 
            src={authImage} 
            alt="Dark wine cellar" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-zinc-950/40" />
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <h3 className="font-serif text-5xl text-white leading-tight text-center">
              Enter the <br/>World of <br/>Fine Wine
            </h3>
          </div>
        </div>

        {/* RIGHT SIDE: The Authentication Form */}
        <div className={`w-full md:w-1/2 flex flex-col justify-center px-10 md:px-16 lg:px-20 py-12 overflow-y-auto transition-opacity duration-200 ${animation === 'fade-in' ? 'opacity-100' : 'opacity-0'}`}>
          
          {/* Header */}
          <h2 className="text-4xl font-serif text-zinc-900 mb-3">
            {isLogin ? 'Welcome Back' : 'Join the Cellar Club'}
          </h2>
          <p className="text-zinc-500 font-light text-sm mb-6">
            {isLogin 
              ? 'Access your private collection and exclusive vintages.' 
              : 'Create an account to manage your preferences and receive curated recommendations.'
            }
          </p>

          {/* Feedback Banners mapping directly to API Responses */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border-l-2 border-red-700 text-red-900 text-xs font-light">
              {error}
            </div>
          )}
          {message && (
            <div className="mb-6 p-3 bg-emerald-50 border-l-2 border-emerald-700 text-emerald-900 text-xs font-light">
              {message}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Name Fields (Only on Register) */}
            {!isLogin && (
              <div className="grid grid-cols-2 gap-6">
                <div className="relative group">
                  <input 
                    type="text" 
                    id="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    placeholder=" "
                    required={!isLogin}
                    className="block w-full pt-6 pb-2 bg-transparent border-0 border-b border-zinc-300 text-zinc-900 text-sm focus:ring-0 focus:border-zinc-900 peer transition-colors"
                  />
                  <label 
                    htmlFor="first_name" 
                    className="absolute text-xs font-bold uppercase tracking-widest text-zinc-500 duration-300 transform -translate-y-4 scale-75 top-4 -z-10 origin-[0] peer-focus:text-zinc-900 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                  >
                    First Name
                  </label>
                </div>

                <div className="relative group">
                  <input 
                    type="text" 
                    id="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    placeholder=" "
                    required={!isLogin}
                    className="block w-full pt-6 pb-2 bg-transparent border-0 border-b border-zinc-300 text-zinc-900 text-sm focus:ring-0 focus:border-zinc-900 peer transition-colors"
                  />
                  <label 
                    htmlFor="last_name" 
                    className="absolute text-xs font-bold uppercase tracking-widest text-zinc-500 duration-300 transform -translate-y-4 scale-75 top-4 -z-10 origin-[0] peer-focus:text-zinc-900 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                  >
                    Last Name
                  </label>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="relative group">
              <input 
                type="email" 
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder=" "
                required
                className="block w-full pt-6 pb-2 bg-transparent border-0 border-b border-zinc-300 text-zinc-900 text-sm focus:ring-0 focus:border-zinc-900 peer transition-colors"
              />
              <label 
                htmlFor="email" 
                className="absolute text-xs font-bold uppercase tracking-widest text-zinc-500 duration-300 transform -translate-y-4 scale-75 top-4 -z-10 origin-[0] peer-focus:text-zinc-900 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
              >
                Email Address
              </label>
            </div>

            {/* Password Field */}
            <div className="relative group">
              <input 
                type="password" 
                id="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder=" "
                required
                className="block w-full pt-6 pb-2 bg-transparent border-0 border-b border-zinc-300 text-zinc-900 text-sm focus:ring-0 focus:border-zinc-900 peer transition-colors"
              />
              <label 
                htmlFor="password" 
                className="absolute text-xs font-bold uppercase tracking-widest text-zinc-500 duration-300 transform -translate-y-4 scale-75 top-4 -z-10 origin-[0] peer-focus:text-zinc-900 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
              >
                {isLogin ? 'Password' : 'Create Password'}
              </label>
            </div>

            {/* Confirm Password Field (Only on Register) */}
            {!isLogin && (
              <div className="relative group">
                <input 
                  type="password" 
                  id="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleInputChange}
                  placeholder=" "
                  required={!isLogin}
                  className="block w-full pt-6 pb-2 bg-transparent border-0 border-b border-zinc-300 text-zinc-900 text-sm focus:ring-0 focus:border-zinc-900 peer transition-colors"
                />
                <label 
                  htmlFor="password_confirmation" 
                  className="absolute text-xs font-bold uppercase tracking-widest text-zinc-500 duration-300 transform -translate-y-4 scale-75 top-4 -z-10 origin-[0] peer-focus:text-zinc-900 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                >
                  Confirm Password
                </label>
              </div>
            )}

            {/* Forgot Password (Only on Login) */}
            {isLogin && (
              <div className="flex justify-end">
                <button type="button" className="text-xs text-zinc-500 hover:underline">
                  Forgot Password?
                </button>
              </div>
            )}

            {/* Action Button interacting cleanly with slice processing loading states */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-zinc-900 text-white py-4 text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-700 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing Authentication...' : (isLogin ? 'Sign In Securely' : 'Create Account')}
            </button>
          </form>

          {/* Toggle Footer */}
          <div className="mt-auto pt-10 border-t border-zinc-100 text-center text-xs text-zinc-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button 
              onClick={toggleMode} 
              className="text-zinc-900 font-bold hover:underline transition-colors"
            >
              {isLogin ? 'Register Now' : 'Sign In'}
            </button>
          </div>

        </div>

      </div>
    </div>,
    document.body
  );
};

export default AuthModal;