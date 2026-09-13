import React from 'react';
import { MapPin, Package } from 'lucide-react';

const STATUS_STYLES = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  processing: 'bg-blue-50 text-blue-700 border-blue-200',
  shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  delivered: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
};

// Renders either a GuestOrderResource or an authenticated OrderResource —
// both share order_number, status, fulfilment_method, totals, items, and
// a delivery_address/pickup_location block.
const OrderSummaryCard = ({ order }) => {
  if (!order) return null;

  const statusStyle = STATUS_STYLES[order.status?.toLowerCase()] || 'bg-zinc-50 text-zinc-700 border-zinc-200';
  const address = order.delivery_address || order.customer_address;

  return (
    <div className="bg-white border border-zinc-200 p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-zinc-100">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Order Number</p>
          <p className="font-serif text-2xl text-zinc-900">{order.order_number}</p>
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 border rounded-full ${statusStyle}`}>
          {order.status || 'Pending'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
        <div className="flex items-start gap-3">
          {order.fulfilment_method === 'pickup' ? (
            <>
              <Package size={18} className="text-forest shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Pickup From</p>
                {order.pickup_location ? (
                  <>
                    <p className="text-sm text-zinc-900 font-medium">{order.pickup_location.name}</p>
                    <p className="text-sm text-zinc-500">{order.pickup_location.address_line_1}</p>
                    {order.pickup_location.opening_hours && (
                      <p className="text-xs text-zinc-400 mt-1">{order.pickup_location.opening_hours}</p>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-zinc-500">Details will be confirmed shortly.</p>
                )}
              </div>
            </>
          ) : (
            <>
              <MapPin size={18} className="text-forest shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Delivering To</p>
                {address ? (
                  <>
                    <p className="text-sm text-zinc-900">{address.address_line_1}</p>
                    <p className="text-sm text-zinc-500">
                      {[address.suburb, address.city].filter(Boolean).join(', ')}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-zinc-500">Details will be confirmed shortly.</p>
                )}
              </div>
            </>
          )}
        </div>

        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Placed By</p>
          <p className="text-sm text-zinc-900">{order.placed_by || order.guest_name || '—'}</p>
        </div>
      </div>

      {order.items?.length > 0 && (
        <div className="divide-y divide-zinc-100 mb-8">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm text-zinc-900">{item.product?.name || 'Item'}</p>
                <p className="text-xs text-zinc-400">Qty {item.quantity}</p>
              </div>
              <p className="text-sm text-zinc-700">GHS {Number(item.price).toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2 pt-6 border-t border-zinc-100">
        <div className="flex justify-between text-sm text-zinc-500">
          <span>Subtotal</span>
          <span>GHS {Number(order.subtotal || 0).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-zinc-500">
          <span>Shipping</span>
          <span>{Number(order.shipping_cost || 0) === 0 ? 'Free' : `GHS ${Number(order.shipping_cost).toFixed(2)}`}</span>
        </div>
        {Number(order.discount_amount || 0) > 0 && (
          <div className="flex justify-between text-sm text-wine">
            <span>Discount</span>
            <span>-GHS {Number(order.discount_amount).toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-serif text-xl text-zinc-900 pt-2">
          <span>Total</span>
          <span>GHS {Number(order.total || 0).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryCard;
