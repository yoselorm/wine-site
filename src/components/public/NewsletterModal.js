import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import toast from '../Toast';
import bottleImg from '../../assets/images/home/home-hero02.png';
import grapesImg from '../../assets/images/home/who-we-are-grapes.png';

const DISMISS_KEY = 'w2u_newsletter_seen';

const NewsletterModal = () => {
  const [visible, setVisible] = useState(false);
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY)) return;

    const timer = setTimeout(() => {
      setVisible(true);
      requestAnimationFrame(() => setShow(true));
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setShow(false);
    setTimeout(() => setVisible(false), 300);
    localStorage.setItem(DISMISS_KEY, '1');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("You're subscribed! Welcome to w2u.");
    dismiss();
  };

  if (!visible) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className={`fixed inset-0 bg-zinc-950/60 backdrop-blur-sm transition-opacity duration-300 ease-out ${show ? 'opacity-100' : 'opacity-0'}`}
        onClick={dismiss}
      />

      <div
        className={`bg-cream w-full max-w-md relative z-50 shadow-2xl overflow-hidden rounded-sm transition-all duration-300 ease-out ${
          show ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-3'
        }`}
      >
        <button
          onClick={dismiss}
          aria-label="Close"
          className="absolute top-4 right-4 text-white/80 hover:text-white z-10 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="relative bg-forest-dark h-56 flex items-center justify-center overflow-hidden">
          <img
            src={grapesImg}
            alt=""
            aria-hidden="true"
            className="absolute -bottom-4 -left-6 w-24 opacity-90"
          />
          <img src={bottleImg} alt="Featured wine bottle" className="relative z-10 h-full w-auto object-contain py-4 drop-shadow-2xl" />
        </div>

        <div className="px-8 py-10 text-center">
          <h2 className="font-serif text-2xl text-zinc-900 mb-2">Get the latest updates!</h2>
          <p className="text-sm text-zinc-500 font-light mb-6">
            Enter your email address below to subscribe to w2u.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="flex-1 border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:border-forest"
            />
            <button
              type="submit"
              className="bg-gold text-forest-dark px-6 py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-gold-light transition-colors"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default NewsletterModal;
