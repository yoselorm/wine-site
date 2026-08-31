import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearStatus } from '../../redux/authSlice';
import WaveDecor from '../../components/public/shared/WaveDecor';
import toast from '../../components/Toast';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearStatus());
    const result = await dispatch(loginUser(formData));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Welcome back!');
      navigate('/');
    }
  };

  return (
    <div className="relative min-h-[80vh] px-6 py-16 overflow-hidden">
      <WaveDecor />

      <div className="relative z-10 max-w-md mx-auto text-center">
        <h1 className="font-serif text-4xl text-zinc-900 mb-3">Login</h1>
        <p className="text-sm text-zinc-500 mb-10">
          Thank you for your interest in Wine 2 U. Please complete the form below to join our Preferred Customer List.
        </p>

        {error && (
          <div className="mb-6 p-3 bg-wine/5 border-l-2 border-wine text-wine text-xs text-left">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <div>
            <label className="block text-sm text-zinc-700 mb-1">Email address</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors"
            />
            <div className="text-right mt-2">
              <button type="button" className="text-xs text-zinc-500 hover:text-gold underline underline-offset-2">
                I forgot my password
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="border border-gold text-gold px-8 py-2.5 text-sm font-medium hover:bg-gold hover:text-white transition-colors disabled:opacity-40"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>

        <p className="text-xs uppercase tracking-widest text-zinc-400 mt-10 mb-5">Or Sign In With</p>
        <div className="flex justify-center gap-4 mb-8">
          <button className="w-10 h-10 rounded-full bg-[#DB4437] text-white flex items-center justify-center font-bold text-sm">G</button>
          <button className="w-10 h-10 rounded-full bg-[#3B5998] text-white flex items-center justify-center font-bold text-sm">f</button>
        </div>

        <Link to="/register" className="text-sm font-semibold text-zinc-800 underline underline-offset-2 hover:text-gold">
          I don't have an account. Register Me
        </Link>
      </div>
    </div>
  );
};

export default Login;
