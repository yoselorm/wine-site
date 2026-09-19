import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, EyeOff } from 'lucide-react';
import { registerUser, clearStatus } from '../../redux/authSlice';
import WaveDecor from '../../components/public/shared/WaveDecor';
import toast from '../../components/Toast';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleContinue = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearStatus());
    const result = await dispatch(registerUser(formData));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Account created successfully!');
      navigate('/login');
    }
  };

  return (
    <div className="relative min-h-[80vh] px-6 py-16 overflow-hidden">
      <WaveDecor />

      <div className="relative z-10 max-w-md mx-auto text-center">
        <h1 className="font-serif text-4xl text-zinc-900 mb-3">Create an account</h1>
        <p className="text-sm text-zinc-500 mb-10">
          Thank you for your interest in Wine 2 U. Please complete the form below to join our Preferred Customer List.
        </p>

        {error && (
          <div className="mb-6 p-3 bg-wine/5 border-l-2 border-wine text-wine text-xs text-left">{error}</div>
        )}

        {step === 1 ? (
          <form onSubmit={handleContinue} className="space-y-6 text-left">
            <div>
              <label className="block text-sm text-zinc-700 mb-1">First Name</label>
              <input
                type="text"
                name="first_name"
                required
                autoFocus
                value={formData.first_name}
                onChange={handleChange}
                className="w-full border border-gold/60 focus:border-gold px-4 py-2.5 text-sm focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-700 mb-1">Last Name</label>
              <input
                type="text"
                name="last_name"
                required
                value={formData.last_name}
                onChange={handleChange}
                className="w-full border border-zinc-300 focus:border-gold px-4 py-2.5 text-sm focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-700 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-zinc-300 focus:border-gold px-4 py-2.5 text-sm focus:outline-none transition-colors"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="border border-gold text-gold px-8 py-2.5 text-sm font-medium hover:bg-gold hover:text-white transition-colors"
              >
                Continue
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <div>
              <label className="block text-sm text-zinc-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  autoFocus
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border border-zinc-300 focus:border-gold px-4 py-2.5 pr-11 text-sm focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm text-zinc-700 mb-1">Confirm password</label>
              <div className="relative">
                <input
                  type={showPasswordConfirm ? 'text' : 'password'}
                  name="password_confirmation"
                  required
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  className="w-full border border-zinc-300 focus:border-gold px-4 py-2.5 pr-11 text-sm focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirm((v) => !v)}
                  aria-label={showPasswordConfirm ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  {showPasswordConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-zinc-500 hover:text-gold underline underline-offset-2"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="border border-gold text-gold px-8 py-2.5 text-sm font-medium hover:bg-gold hover:text-white transition-colors disabled:opacity-40"
              >
                {loading ? 'Creating...' : 'Create Account'}
              </button>
            </div>
          </form>
        )}

        <p className="text-xs uppercase tracking-widest text-zinc-400 mt-10 mb-5">Or Sign Up With</p>
        <div className="flex justify-center gap-4 mb-8">
          <button className="w-10 h-10 rounded-full bg-[#DB4437] text-white flex items-center justify-center font-bold text-sm">G</button>
          <button className="w-10 h-10 rounded-full bg-[#3B5998] text-white flex items-center justify-center font-bold text-sm">f</button>
        </div>

        <Link to="/login" className="text-sm font-semibold text-zinc-800 underline underline-offset-2 hover:text-gold">
          I already have an account. Log me in.
        </Link>
      </div>
    </div>
  );
};

export default Register;
