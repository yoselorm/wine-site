import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search } from 'lucide-react';
import { lookupGuestOrder, clearGuestOrderState } from '../../redux/guestOrderSlice';
import OrderSummaryCard from '../../components/public/checkout/OrderSummaryCard';

const TrackOrder = () => {
  const dispatch = useDispatch();
  const { lookedUpOrder, lookingUp, lookupError } = useSelector((state) => state.guestOrder);
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(lookupGuestOrder({ order_number: orderNumber.trim(), email: email.trim() }));
  };

  const handleReset = () => {
    dispatch(clearGuestOrderState());
    setOrderNumber('');
    setEmail('');
  };

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl md:text-4xl text-zinc-900 mb-3">Track Your Order</h1>
          <p className="text-zinc-500 font-light">
            Enter your order number and the email address you checked out with.
          </p>
        </div>

        {lookedUpOrder ? (
          <>
            <OrderSummaryCard order={lookedUpOrder} />
            <div className="flex justify-center mt-8">
              <button
                onClick={handleReset}
                className="text-[11px] font-bold uppercase tracking-widest text-forest border-b border-forest pb-1 hover:text-forest-dark hover:border-forest-dark transition-colors"
              >
                Look Up Another Order
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white border border-zinc-200 p-8 space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Order Number</label>
              <input
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                required
                placeholder="ORD-2609-K4M2XP"
                className="w-full p-3 border border-zinc-200 text-sm rounded-md focus:outline-none focus:border-forest transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border border-zinc-200 text-sm rounded-md focus:outline-none focus:border-forest transition-colors"
              />
            </div>

            {lookupError && <p className="text-xs text-wine">{lookupError}</p>}

            <button
              type="submit"
              disabled={lookingUp}
              className="w-full flex items-center justify-center gap-2 bg-forest text-white py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-forest-dark transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Search size={14} /> {lookingUp ? 'Searching...' : 'Find My Order'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
