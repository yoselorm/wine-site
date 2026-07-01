import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsTasteProfileComplete } from '../../redux/tasteProfileSlice';

const DISMISS_KEY = 'taste_profile_reminder_dismissed';

const TasteProfileReminderModal = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { profile, loading } = useSelector((state) => state.tasteProfile);
  const isComplete = useSelector(selectIsTasteProfileComplete);

  const [visible, setVisible] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || loading) return;
    const alreadyDismissed = sessionStorage.getItem(DISMISS_KEY);
    if (!isComplete && !alreadyDismissed) {
      setVisible(true);
      const id = requestAnimationFrame(() => setShow(true));
      return () => cancelAnimationFrame(id);
    }
  }, [isAuthenticated, loading, isComplete]);

  const dismiss = (remember = true) => {
    setShow(false);
    setTimeout(() => setVisible(false), 300);
    if (remember) sessionStorage.setItem(DISMISS_KEY, '1');
  };

  const handleCompleteNow = () => {
    dismiss(false);
    navigate('/user/taste-profile');
  };

  if (!visible) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className={`fixed inset-0 bg-zinc-950/40 backdrop-blur-sm transition-opacity duration-300 ease-out ${show ? 'opacity-100' : 'opacity-0'}`}
        onClick={() => dismiss()}
      />

      <div
        className={`bg-white w-full max-w-sm p-8 relative z-50 rounded-xl shadow-2xl border border-zinc-100 text-center transition-all duration-300 ease-out ${
          show ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-3'
        }`}
      >
        <button onClick={() => dismiss()} className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 transition-colors">
          <X size={18} />
        </button>

        <div className="w-14 h-14 mx-auto rounded-full bg-zinc-900 flex items-center justify-center mb-5">
          <Sparkles size={22} className="text-white" />
        </div>

        <h2 className="text-xl font-serif text-zinc-900 mb-2">Complete Your Taste Profile</h2>
        <p className="text-sm text-zinc-500 font-light mb-8 leading-relaxed">
          Tell us what you like so our Virtual Sommelier can give you accurate, personalized wine recommendations.
        </p>

        <button
          onClick={handleCompleteNow}
          className="w-full bg-zinc-900 text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors rounded-md mb-3"
        >
          Complete Now
        </button>
        <button
          onClick={() => dismiss()}
          className="text-[11px] text-zinc-400 hover:text-zinc-900 transition-colors"
        >
          Remind me later
        </button>
      </div>
    </div>,
    document.body
  );
};

export default TasteProfileReminderModal;