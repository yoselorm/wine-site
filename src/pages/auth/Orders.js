import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Package, ChevronRight } from 'lucide-react';
import { fetchOrders } from '../../redux/orderSlice';

const STATUS_STYLES = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  processing: 'bg-blue-50 text-blue-700 border-blue-200',
  shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  delivered: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
};

const Orders = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-12 md:py-24">
        <h1 className="text-3xl font-serif text-zinc-900 mb-8">My Orders</h1>
        <div className="space-y-4 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-zinc-100" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-24 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => dispatch(fetchOrders())}
          className="text-xs font-bold uppercase tracking-widest border-b border-forest pb-1 hover:text-forest transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-32 flex flex-col items-center justify-center text-center">
        <Package size={48} strokeWidth={1} className="text-zinc-300 mb-6" />
        <h2 className="text-2xl font-serif text-zinc-900 mb-4">No orders yet</h2>
        <p className="text-zinc-500 font-light max-w-md mb-8">
          When you place an order, it will show up here so you can track its status.
        </p>
        <Link
          to="/shop"
          className="bg-forest text-white px-8 py-4 text-[11px] font-bold uppercase tracking-widest hover:bg-forest-dark transition-colors duration-300"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 md:py-24">
      <div className="mb-12 border-b border-zinc-200 pb-6">
        <h1 className="text-3xl lg:text-4xl font-serif text-zinc-900 mb-2">My Orders</h1>
        <p className="text-sm text-zinc-500 font-light">{items.length} {items.length === 1 ? 'order' : 'orders'}</p>
      </div>

      <div className="flex flex-col divide-y divide-zinc-200">
        {items.map((order) => {
          const statusStyle = STATUS_STYLES[order.status?.toLowerCase()] || 'bg-zinc-50 text-zinc-700 border-zinc-200';
          return (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-6 hover:bg-zinc-50 transition-colors -mx-4 sm:-mx-6 px-4 sm:px-6"
            >
              <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-zinc-100 flex items-center justify-center shrink-0">
                  <Package size={18} className="text-zinc-400" />
                </div>
                <div className="min-w-0">
                  <p className="font-serif text-base sm:text-lg text-zinc-900 mb-1 truncate">
                    Order #{order.order_number || order.id}
                  </p>
                  <p className="text-xs text-zinc-400 font-light truncate">
                    {order.created_at ? new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                    {order.items?.length ? ` · ${order.items.length} ${order.items.length === 1 ? 'item' : 'items'}` : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 pl-16 sm:pl-0">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 border rounded-full shrink-0 ${statusStyle}`}>
                  {order.status || 'Pending'}
                </span>
                <span className="text-sm font-light text-zinc-900 sm:w-20 text-right shrink-0">
                  GHS {Number(order.total || order.total_amount || 0).toFixed(2)}
                </span>
                <ChevronRight size={16} className="text-zinc-300 group-hover:text-forest transition-colors shrink-0 hidden sm:block" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;