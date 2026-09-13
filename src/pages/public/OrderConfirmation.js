import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import OrderSummaryCard from '../../components/public/checkout/OrderSummaryCard';

const OrderConfirmation = () => {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return (
      <div className="bg-cream min-h-screen flex flex-col items-center justify-center py-32 text-center px-6">
        <h1 className="font-serif text-2xl text-zinc-900 mb-3">No confirmation to show</h1>
        <p className="text-zinc-500 font-light mb-8 max-w-sm">
          This page only shows details right after you place an order. Looking for an order you already placed?
        </p>
        <div className="flex items-center gap-4">
          <Link
            to="/track-order"
            className="border border-forest text-forest px-8 py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-forest hover:text-white transition-colors"
          >
            Track an Order
          </Link>
          <Link
            to="/shop"
            className="bg-forest text-white px-8 py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-forest-dark transition-colors duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <CheckCircle2 size={48} className="text-forest mx-auto mb-5" strokeWidth={1.5} />
          <h1 className="font-serif text-3xl text-zinc-900 mb-3">Thank you, order placed!</h1>
          <p className="text-zinc-500 font-light">
            Keep your order number handy — you'll need it, together with your email, to look up this order later.
          </p>
        </div>

        <OrderSummaryCard order={order} />

        <div className="flex justify-center mt-10">
          <Link
            to="/shop"
            className="border border-forest text-forest px-10 py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-forest hover:text-white transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
