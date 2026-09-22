import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Wine } from 'lucide-react';

const VERIFIED_KEY = 'w2u_age_verified';

// No backdrop-click or close button by design — this gate isn't optional, unlike
// the newsletter modal. It shows immediately (no delay) and blocks the page
// underneath until the visitor confirms they're of legal drinking age.
const AgeVerificationModal = () => {
  const [visible, setVisible] = useState(false);
  const [show, setShow] = useState(false);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(VERIFIED_KEY)) return;
    setVisible(true);
    requestAnimationFrame(() => setShow(true));
  }, []);

  const confirm = () => {
    localStorage.setItem(VERIFIED_KEY, '1');
    setShow(false);
    setTimeout(() => setVisible(false), 300);
  };

  if (!visible) return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div
        className={`fixed inset-0 bg-forest-dark/95 backdrop-blur-sm transition-opacity duration-300 ease-out ${
          show ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div
        className={`bg-cream w-full max-w-sm relative z-50 shadow-2xl rounded-sm text-center px-8 py-10 transition-all duration-300 ease-out ${
          show ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-3'
        }`}
      >
        {denied ? (
          <>
            <Wine size={32} className="text-wine mx-auto mb-4" strokeWidth={1.5} />
            <h2 className="font-serif text-xl text-zinc-900 mb-3">Sorry</h2>
            <p className="text-sm text-zinc-500 font-light">
              You must be 18 years or older to enter this site. Please come back once you meet the legal drinking age.
            </p>
          </>
        ) : (
          <>
            <Wine size={32} className="text-gold mx-auto mb-4" strokeWidth={1.5} />
            <h2 className="font-serif text-2xl text-zinc-900 mb-3">Are you 18 or older?</h2>
            <p className="text-sm text-zinc-500 font-light mb-8">
              This website features alcoholic beverages. You must be of legal drinking age to enter.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setDenied(true)}
                className="flex-1 border border-zinc-300 text-zinc-600 px-6 py-3 text-[11px] font-bold uppercase tracking-widest hover:border-zinc-400 transition-colors"
              >
                No
              </button>
              <button
                type="button"
                onClick={confirm}
                className="flex-1 bg-forest text-white px-6 py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-forest-dark transition-colors"
              >
                Yes, I'm 18+
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
};

export default AgeVerificationModal;
