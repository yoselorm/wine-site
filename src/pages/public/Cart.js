import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import {
  selectCartItems,
  selectCartTotal,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
} from '../../redux/cartSlice';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);

  if (items.length === 0) {
    return (
      <div className="bg-cream min-h-screen flex flex-col items-center justify-center py-32 text-center px-6">
        <ShoppingBag size={48} strokeWidth={1} className="text-zinc-300 mb-6" />
        <h1 className="font-serif text-2xl text-zinc-900 mb-3">Your cart is empty</h1>
        <p className="text-zinc-500 font-light mb-8">Browse our collection and find something to love.</p>
        <Link
          to="/shop"
          className="bg-forest text-white px-8 py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-forest-dark transition-colors duration-300"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-3xl lg:text-4xl font-serif text-zinc-900 mb-10 border-b border-zinc-200 pb-6">Your Cart</h1>

        <div className="flex flex-col divide-y divide-zinc-200 mb-10">
          {items.map((item) => (
            <div key={item.id} className="flex flex-wrap sm:flex-nowrap items-center gap-4 sm:gap-6 py-6">
              <div className="w-16 h-24 sm:w-20 sm:h-28 bg-white shrink-0 overflow-hidden">
                <img src={item.image_url} alt={item.name} className="w-full h-full object-contain" />
              </div>
              <div className="flex-1 min-w-[140px]">
                <h3 className="font-serif text-lg text-zinc-900 truncate mb-1">{item.name}</h3>
                <p className="text-sm text-zinc-500">GHS {Number(item.price).toFixed(2)}</p>
              </div>
              <div className="flex items-center border border-zinc-300 h-10 w-28 shrink-0">
                <button
                  onClick={() => dispatch(decrementQuantity(item.id))}
                  className="w-9 h-full flex items-center justify-center text-zinc-500 hover:text-forest transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="flex-1 text-center text-sm font-bold">{item.quantity}</span>
                <button
                  onClick={() => dispatch(incrementQuantity(item.id))}
                  className="w-9 h-full flex items-center justify-center text-zinc-500 hover:text-forest transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
              <p className="w-24 text-right text-sm font-semibold text-zinc-900 shrink-0">
                GHS {(Number(item.price) * item.quantity).toFixed(2)}
              </p>
              <button
                onClick={() => dispatch(removeFromCart(item.id))}
                className="text-zinc-400 hover:text-wine transition-colors shrink-0"
                aria-label="Remove from cart"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white border border-zinc-200 p-8">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Subtotal</p>
            <p className="font-serif text-3xl text-zinc-900">GHS {total.toFixed(2)}</p>
          </div>
          <button
            onClick={() => navigate('/checkout')}
            className="bg-forest text-white px-10 py-4 text-[11px] font-bold uppercase tracking-widest hover:bg-forest-dark transition-colors duration-300 shrink-0"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
